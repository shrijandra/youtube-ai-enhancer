from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.services.ffmpeg_service import extract_audio_to_wav
from fastapi.responses import FileResponse

router = APIRouter()

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")

@router.get("/outputs/{filename}")
def download_output(filename: str):
    file_path = OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    return FileResponse(
        path=file_path,
        media_type="audio/wav",
        filename=filename,
    )

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

        output_filename = Path(wav_path).name

        return {
            "message": "Audio extracted successfully",
            "input_file": filename,
            "wav_file": output_filename,
            "download_url": f"http://localhost:8000/outputs/{output_filename}",
}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )