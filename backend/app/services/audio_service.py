import subprocess


def clamp(value: int, min_value: int = 0, max_value: int = 100) -> int:
    return max(min_value, min(value, max_value))


def build_audio_filters(settings):
    noise = clamp(settings.noiseReduction)
    clarity = clamp(settings.voiceClarity)
    echo = clamp(settings.echoRemoval)
    loudness = clamp(settings.loudness)

    filters = []

    # Remove low rumble / AC / desk vibration
    filters.append("highpass=f=90")

    # Remove unnecessary high-end hiss
    filters.append("lowpass=f=13500")

    # Noise reduction
    if noise > 0:
        filters.append("afftdn=nf=-28:tn=1")

    # Reduce muddy voice area
    filters.append("equalizer=f=250:t=q:w=1:g=-2")

    # Improve speech clarity / presence
    if clarity > 0:
        clarity_gain = round((clarity / 100) * 5, 2)
        filters.append(f"equalizer=f=3000:t=q:w=1:g={clarity_gain}")
        filters.append(f"equalizer=f=5000:t=q:w=1:g={round(clarity_gain / 2, 2)}")

    # Echo/harshness approximation
    if echo > 0:
        filters.append("deesser")

    # Voice compression: makes speech more even and professional
    filters.append(
        "acompressor=threshold=-20dB:ratio=3.5:attack=15:release=250:makeup=3"
    )

    # Soft limiter to prevent clipping
    filters.append("alimiter=limit=0.95")

    # Loudness normalization
    target_loudness = -16 if loudness >= 70 else -18
    filters.append(f"loudnorm=I={target_loudness}:TP=-1.5:LRA=11")

    return ",".join(filters)


def enhance_audio(input_wav, output_wav, settings):
    filter_chain = build_audio_filters(settings)

    command = [
        "ffmpeg",
        "-y",
        "-i", str(input_wav),
        "-af", filter_chain,
        "-ar", "44100",
        "-ac", "2",
        str(output_wav),
    ]

    print("Audio filter chain:")
    print(filter_chain)

    subprocess.run(command, check=True)

    return output_wav