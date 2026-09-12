import subprocess


def clamp(value: int, min_value: int = 0, max_value: int = 100) -> int:
    return max(min_value, min(value, max_value))


def build_audio_filters(settings):
    noise = clamp(settings.noiseReduction)
    clarity = clamp(settings.voiceClarity)
    echo = clamp(settings.echoRemoval)
    loudness = clamp(settings.loudness)

    # V3.2 - when click suppression is on, stop lifting the band
    # the clicks live in. Backing off the 5 kHz presence boost is
    # the only change that survives the loudnorm at the end of
    # this chain; adding a transient compressor here does not.
    click_safe = settings.clickNoiseSuppression

    filters = []

    # Remove low rumble / AC / desk vibration
    filters.append("highpass=f=90")

    # Remove unnecessary high-end hiss
    filters.append("lowpass=f=13500")

    # Noise reduction. nr is the actual strength knob (0.01-97);
    # nf is only the assumed noise floor, so scaling nf instead
    # leaves the slider doing nothing. Capped at 24 dB because
    # afftdn starts adding watery "musical noise" past that.
    if noise > 0:
        noise_reduction_db = round(6 + ((noise / 100) * 18), 2)
        filters.append(f"afftdn=nr={noise_reduction_db}:nf=-28:tn=1")

    # Reduce muddy voice area
    filters.append("equalizer=f=250:t=q:w=1:g=-2")

    # Improve speech clarity / presence
    if clarity > 0:
        clarity_gain = round((clarity / 100) * 5, 2)

        # 5 kHz is where click transients peak, so back that band
        # off rather than lifting it as hard as 3 kHz
        presence_divisor = 4 if click_safe else 2

        filters.append(f"equalizer=f=3000:t=q:w=1:g={clarity_gain}")
        filters.append(
            f"equalizer=f=5000:t=q:w=1:"
            f"g={round(clarity_gain / presence_divisor, 2)}"
        )

    # Sibilance / harshness.
    #
    # deesser needs care. Its intensity defaults to 0, so a bare
    # "deesser" does nothing at all. Worse, i is very nonlinear:
    # measured on a 7 kHz sibilance probe, i<=0.4 is inert and
    # the entire usable response lives between 0.5 and 1.0
    # (-1 dB to -14 dB). So the slider maps onto 0.45-0.95
    # rather than 0-1, or its bottom half would be dead.
    #
    # Do not pass m. Despite the name, m=1.0 disables the effect
    # outright - it behaves as an inverse threshold.
    #
    # Note this is de-essing, not echo removal. ffmpeg has no
    # real dereverb, so the slider's label overpromises.
    if echo > 0:
        deess_intensity = round(0.45 + ((echo / 100) * 0.5), 3)
        filters.append(f"deesser=i={deess_intensity}")

    # Voice compression: makes speech more even and professional
    filters.append(
        "acompressor=threshold=-20dB:ratio=3.5:attack=15:release=250:makeup=3"
    )

    # Soft limiter to prevent clipping
    filters.append("alimiter=limit=0.95")

    # Loudness normalization. Continuous across the slider
    # instead of two discrete steps, and it now actually reaches
    # -14 LUFS - the YouTube target the analysis dashboard
    # reports but the old -16/-18 split could never hit.
    target_loudness = round(-20 + ((loudness / 100) * 6), 1)
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