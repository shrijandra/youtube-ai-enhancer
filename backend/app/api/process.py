from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.services.ffmpeg_service import extract_audio_to_wav

router = APIRouter()

UPLOAD_DIR = Path("uploads")


@router.post("/process/{filename}")
def process_file(filename: str):
    input_path = UPLOAD_DIR / filename

    if not input_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found",
        )

    try:
        wav_path = extract_audio_to_wav(str(input_path))

        return {
            "message": "Audio extracted successfully",
            "input_file": filename,
            "wav_file": wav_path,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )