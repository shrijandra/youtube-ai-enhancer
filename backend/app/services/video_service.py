from pathlib import Path
import subprocess
import uuid

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(exist_ok=True)

def enhance_video(input_path: str):
    input_file = Path(input_path)

    output_filename = f"enhanced_{uuid.uuid4().hex}_{input_file.stem}.mp4"
    output_path = OUTPUT_DIR / output_filename

    command = [
        "ffmpeg",
        "-y",
        "-i", str(input_file),
        "-vf", "eq=brightness=0.05:contrast=1.15:saturation=1.2,unsharp=5:5:1.0:5:5:0.0",
        "-af", "loudnorm",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        str(output_path),
    ]

    subprocess.run(command, check=True)

    return str(output_path)