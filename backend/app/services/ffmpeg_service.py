import subprocess
from pathlib import Path


def run(command):
    subprocess.run(
        command,
        check=True
    )


def extract_audio(video, wav):

    command = [

        "ffmpeg",
        "-y",

        "-i", str(video),

        "-vn",

        "-acodec", "pcm_s16le",

        "-ar", "44100",

        "-ac", "2",

        str(wav)

    ]

    run(command)


def merge_audio(video, audio, output):
    
    command = [

        "ffmpeg",

        "-y",

        "-i", str(video),

        "-i", str(audio),

        "-map", "0:v:0",

        "-map", "1:a:0",

        "-c:v", "copy",

        "-c:a", "aac",

        "-b:a", "192k",

        "-shortest",

        str(output)

    ]

    run(command)