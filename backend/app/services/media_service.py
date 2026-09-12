from pathlib import Path
import uuid

from app.core.config import OUTPUT_DIR, TEMP_DIR
from app.services.ffmpeg_service import extract_audio, merge_audio
from app.services.audio_service import enhance_audio

# V3.1
from app.services.baby_noise_suppressor import extract_clean_speech

# V3.2
from app.services.click_suppressor import suppress_click_noise


AUDIO_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".aac",
    ".m4a",
    ".flac",
}

VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
}


def prepare_speech_track(working_audio, settings, job_id):
    """
    Run the pre-enhancement cleanup stages.

    Both run before enhance_audio on purpose: the clarity EQ and
    makeup gain in the enhancement chain would otherwise amplify
    whatever these stages are meant to remove.
    """

    # V3.1 baby/background suppression
    if settings.babyNoiseSuppression:
        baby_cleaned_audio = (
            TEMP_DIR / f"baby_cleaned_{job_id}.wav"
        )

        print("👶 Baby/background suppression enabled")
        print(
            f"Suppression strength: "
            f"{settings.babyNoiseStrength}%"
        )

        working_audio = extract_clean_speech(
            input_file=working_audio,
            output_file=baby_cleaned_audio,
        )

    # V3.2 keyboard/mouse click suppression
    if settings.clickNoiseSuppression:
        click_cleaned_audio = (
            TEMP_DIR / f"click_cleaned_{job_id}.wav"
        )

        print("⌨️  Keyboard/mouse click suppression enabled")
        print(
            f"Suppression strength: "
            f"{settings.clickNoiseStrength}%"
        )

        working_audio = suppress_click_noise(
            input_file=working_audio,
            output_file=click_cleaned_audio,
            strength=settings.clickNoiseStrength,
        )

    return working_audio


def process_media(input_file, settings):
    input_file = Path(input_file)
    extension = input_file.suffix.lower()
    job_id = uuid.uuid4().hex

    # =========================================================
    # AUDIO
    # =========================================================
    if extension in AUDIO_EXTENSIONS:
        working_audio = prepare_speech_track(
            working_audio=input_file,
            settings=settings,
            job_id=job_id,
        )

        enhanced_audio = (
            OUTPUT_DIR / f"enhanced_audio_{job_id}.wav"
        )

        enhance_audio(
            input_wav=working_audio,
            output_wav=enhanced_audio,
            settings=settings,
        )

        return enhanced_audio

    # =========================================================
    # VIDEO
    # =========================================================
    if extension in VIDEO_EXTENSIONS:
        extracted_audio = (
            TEMP_DIR / f"extracted_{job_id}.wav"
        )

        enhanced_audio = (
            TEMP_DIR / f"enhanced_{job_id}.wav"
        )

        enhanced_video = (
            OUTPUT_DIR / f"enhanced_video_{job_id}.mp4"
        )

        # Extract audio from video
        extract_audio(
            video=input_file,
            wav=extracted_audio,
        )

        working_audio = prepare_speech_track(
            working_audio=extracted_audio,
            settings=settings,
            job_id=job_id,
        )

        # Existing enhancement
        enhance_audio(
            input_wav=working_audio,
            output_wav=enhanced_audio,
            settings=settings,
        )

        # Merge enhanced audio back into video
        merge_audio(
            video=input_file,
            audio=enhanced_audio,
            output=enhanced_video,
        )

        return enhanced_video

    raise Exception("Unsupported media type")