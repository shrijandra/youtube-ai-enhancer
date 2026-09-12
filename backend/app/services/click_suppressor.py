from pathlib import Path
import subprocess

from app.services.audio_service import clamp


class ClickNoiseSuppressionError(RuntimeError):
    pass


def build_click_filters(strength: int) -> str:
    """
    Build the ffmpeg chain that strips keyboard and mouse-click
    transients before the main enhancement runs.

    Keyboard and mouse clicks are short broadband bursts
    (roughly 5-50 ms). Running them through the normal chain
    amplifies them - the clarity EQ lifts 3-5 kHz where the
    click energy sits, and the makeup gain raises whatever the
    compressor's 15 ms attack failed to catch. So they have to
    come out before enhancement, not after.

    adeclick does the work on its own. Two things that look
    reasonable but measurably hurt, so don't add them back
    without re-measuring:

      - A fast-attack compressor. It lowers the click, but it
        lowers the voice by nearly as much, and the loudnorm at
        the end of the enhancement chain undoes the difference.
      - A dip in the click band. The click is broadband, so a
        4 kHz notch costs more voice than click.

    Tuning notes (measured on a 150 Hz harmonic voice proxy with
    2 ms broadband click bursts, scored on click-to-voice ratio):
      - arorder must stay low. 2 scores 8.6 dB, 8 scores 15.9 dB.
      - window=75 is the sweet spot; 55 and 100 both score worse.
    """

    strength = clamp(strength)

    # Lower threshold detects more impulsive bursts.
    # 3.0 is barely-on, 1.0 is aggressive.
    threshold = round(3.0 - ((strength / 100) * 2.0), 2)

    return (
        "adeclick="
        "window=75:"
        "overlap=75:"
        "arorder=2:"
        f"threshold={threshold}:"
        "burst=2"
    )


def suppress_click_noise(
    input_file: str | Path,
    output_file: str | Path,
    strength: int = 60,
) -> Path:
    """
    Remove keyboard/mouse click transients from a track.

    Kept isolated from the main enhancement so a transient
    detection model can replace this implementation later
    without touching the rest of the pipeline.
    """

    input_path = Path(input_file).resolve()
    output_path = Path(output_file).resolve()

    if not input_path.exists():
        raise FileNotFoundError(
            f"Input media not found: {input_path}"
        )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    filter_chain = build_click_filters(strength)

    command = [
        "ffmpeg",
        "-y",

        "-i",
        str(input_path),

        # Ignore video
        "-vn",

        "-af",
        filter_chain,

        "-c:a",
        "pcm_s16le",

        str(output_path),
    ]

    print("Click suppression filter chain:")
    print(filter_chain)

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        raise ClickNoiseSuppressionError(
            "Keyboard/mouse click suppression failed.\n"
            f"{result.stderr}"
        )

    if not output_path.exists():
        raise ClickNoiseSuppressionError(
            "Processing completed but output file "
            "was not created."
        )

    return output_path
