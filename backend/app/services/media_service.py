from pathlib import Path
import uuid

from app.core.config import OUTPUT_DIR, TEMP_DIR
from app.services.ffmpeg_service import extract_audio, merge_audio
from app.services.audio_service import enhance_audio


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


def process_media(input_file, settings):
    input_file = Path(input_file)
    extension = input_file.suffix.lower()
    job_id = uuid.uuid4().hex

    if extension in AUDIO_EXTENSIONS:
        enhanced_audio = OUTPUT_DIR / f"enhanced_audio_{job_id}.wav"

        enhance_audio(
            input_wav=input_file,
            output_wav=enhanced_audio,
            settings=settings,
        )

        return enhanced_audio

    if extension in VIDEO_EXTENSIONS:
        extracted_audio = TEMP_DIR / f"extracted_{job_id}.wav"
        enhanced_audio = TEMP_DIR / f"enhanced_{job_id}.wav"
        enhanced_video = OUTPUT_DIR / f"enhanced_video_{job_id}.mp4"

        extract_audio(
            video=input_file,
            wav=extracted_audio,
        )

        enhance_audio(
            input_wav=extracted_audio,
            output_wav=enhanced_audio,
            settings=settings,
        )

        merge_audio(
            video=input_file,
            audio=enhanced_audio,
            output=enhanced_video,
        )

        return enhanced_video

    raise Exception("Unsupported media type")