import json
import re
import subprocess
from pathlib import Path
from app.core.config import TEMP_DIR


def analyze_audio(input_file: Path):
    temp_wav = TEMP_DIR / f"analysis_{input_file.stem}.wav"

    # Extract audio to WAV first
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(input_file),
            "-vn",
            "-acodec", "pcm_s16le",
            "-ar", "44100",
            "-ac", "2",
            str(temp_wav),
        ],
        check=True,
    )

    # Loudness analysis
    loudness_cmd = [
        "ffmpeg",
        "-i", str(temp_wav),
        "-filter_complex", "ebur128=peak=true",
        "-f", "null",
        "-"
    ]

    loudness_result = subprocess.run(
        loudness_cmd,
        stderr=subprocess.PIPE,
        stdout=subprocess.PIPE,
        text=True,
    )

    output = loudness_result.stderr

    integrated_lufs = None
    true_peak = None
    lra = None

    integrated_match = re.findall(r"I:\s*(-?\d+\.?\d*) LUFS", output)
    peak_match = re.findall(r"Peak:\s*(-?\d+\.?\d*) dBFS", output)
    lra_match = re.findall(r"LRA:\s*(-?\d+\.?\d*) LU", output)

    if integrated_match:
        integrated_lufs = float(integrated_match[-1])

    if peak_match:
        true_peak = float(peak_match[-1])

    if lra_match:
        lra = float(lra_match[-1])

    # Duration
    duration_cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "json",
        str(input_file),
    ]

    duration_result = subprocess.run(
        duration_cmd,
        stdout=subprocess.PIPE,
        text=True,
        check=True,
    )

    duration = float(json.loads(duration_result.stdout)["format"]["duration"])

    # Pause detection
    silence_cmd = [
        "ffmpeg",
        "-i", str(temp_wav),
        "-af", "silencedetect=noise=-35dB:d=0.3",
        "-f", "null",
        "-"
    ]

    silence_result = subprocess.run(
        silence_cmd,
        stderr=subprocess.PIPE,
        stdout=subprocess.PIPE,
        text=True,
    )

    pauses = len(re.findall(r"silence_start", silence_result.stderr))

    return {
        "duration_seconds": round(duration, 2),
        "duration_minutes": round(duration / 60, 2),
        "avg_loudness_lufs": integrated_lufs,
        "true_peak_dbfs": true_peak,
        "dynamic_range_lra": lra,
        "pauses_detected": pauses,
        "youtube_target_lufs": -14,
        "loudness_gap": round(-14 - integrated_lufs, 1) if integrated_lufs else None,
        "clipping_warning": true_peak is not None and true_peak > -1,
    }