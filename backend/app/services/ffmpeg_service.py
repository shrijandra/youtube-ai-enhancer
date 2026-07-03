from pathlib import Path
import ffmpeg


def extract_audio_to_wav(input_path: str, output_dir: str = "outputs") -> str:
    input_file = Path(input_path)
    output_folder = Path(output_dir)
    output_folder.mkdir(exist_ok=True)

    output_file = output_folder / f"{input_file.stem}.wav"

    try:
        (
            ffmpeg
            .input(str(input_file))
            .output(
                str(output_file),
                acodec="pcm_s16le",
                ac=1,
                ar="48000",
                vn=None
            )
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )

        return str(output_file)

    except ffmpeg.Error as e:
        error_message = e.stderr.decode() if e.stderr else "Unknown FFmpeg error"
        raise RuntimeError(error_message)