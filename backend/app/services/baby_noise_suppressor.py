from pathlib import Path
import subprocess


class BabyNoiseSuppressionError(RuntimeError):
    pass


def extract_clean_speech(
    input_file: str | Path,
    output_file: str | Path,
) -> Path:
    """
    V3.1 initial baby/background vocal suppression pipeline.

    This first stage:
      1. normalizes audio to mono/48 kHz
      2. applies conservative speech-focused cleanup
      3. keeps the function isolated so a source-separation
         model can replace this implementation later
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

    command = [
        "ffmpeg",
        "-y",

        "-i",
        str(input_path),

        # Ignore video
        "-vn",

        # Mono speech track
        "-ac",
        "1",

        # Speech/source-separation friendly sample rate
        "-ar",
        "48000",

        # Conservative speech cleanup
        "-af",
        (
            "highpass=f=80,"
            "lowpass=f=12000,"
            "afftdn=nf=-30,"
            "acompressor="
            "threshold=-18dB:"
            "ratio=2.5:"
            "attack=10:"
            "release=120"
        ),

        "-c:a",
        "pcm_s16le",

        str(output_path),
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        raise BabyNoiseSuppressionError(
            "Baby/background noise preprocessing failed.\n"
            f"{result.stderr}"
        )

    if not output_path.exists():
        raise BabyNoiseSuppressionError(
            "Processing completed but output file "
            "was not created."
        )

    return output_path