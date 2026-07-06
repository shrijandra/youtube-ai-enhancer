import subprocess


def clamp(value: int, min_value: int = 0, max_value: int = 100) -> int:
    return max(min_value, min(value, max_value))


def build_audio_filters(settings):
    noise = clamp(settings.noiseReduction)
    clarity = clamp(settings.voiceClarity)
    echo = clamp(settings.echoRemoval)
    loudness = clamp(settings.loudness)

    filters = []

    # Remove low rumble
    filters.append("highpass=f=80")

    # Remove harsh high-end noise
    filters.append("lowpass=f=14000")

    # Noise reduction
    if noise > 0:
        noise_strength = round(noise / 100 * 0.25, 2)
        filters.append(f"afftdn=nf=-25:tn=1")

    # Voice clarity
    if clarity > 0:
        clarity_gain = round((clarity / 100) * 4, 2)
        filters.append(f"equalizer=f=3000:t=q:w=1:g={clarity_gain}")

    # Echo / harshness reduction approximation
    if echo > 0:
        filters.append("deesser")

    # Compression for stronger voice presence
    filters.append(
        "acompressor=threshold=-18dB:ratio=3:attack=20:release=250:makeup=2"
    )

    # Loudness normalization
    target_loudness = -18 + ((100 - loudness) / 100 * 4)
    filters.append(
        f"loudnorm=I={round(target_loudness, 1)}:TP=-1.5:LRA=11"
    )

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

    subprocess.run(command, check=True)

    return output_wav