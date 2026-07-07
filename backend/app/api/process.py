from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.config import UPLOAD_DIR, OUTPUT_DIR
from app.models.schemas import ProcessRequest
from app.services.media_service import process_media
import time
from app.services.audio_analysis_service import analyze_audio
router = APIRouter()

@router.get("/analyze/{filename}")
def analyze_file(filename: str):
    input_path = OUTPUT_DIR / filename

    if not input_path.exists():
        input_path = UPLOAD_DIR / filename

    if not input_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    try:
        return analyze_audio(input_path)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.get("/outputs/{filename}")
def download_output(filename: str):
    file_path = OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found",
        )

    media_type = "application/octet-stream"

    if file_path.suffix.lower() == ".wav":
        media_type = "audio/wav"

    if file_path.suffix.lower() == ".mp4":
        media_type = "video/mp4"

    return FileResponse(
        path=file_path,
        media_type=media_type,
        filename=filename,
    )


@router.post("/process")
def process_file(request: ProcessRequest):
    input_path = UPLOAD_DIR / request.filename

    if not input_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found",
        )

    print("\n" + "=" * 70)
    print("🚀 AI Creator Studio V2 - Processing Started")
    print(f"Input File : {request.filename}")
    print(f"Settings   : {request.settings.model_dump()}")
    print("=" * 70)

    start = time.time()

    try:
        output_path = process_media(
            input_file=input_path,
            settings=request.settings,
        )

        elapsed = round(time.time() - start, 2)

        output_filename = Path(output_path).name

        media_type = (
            "video"
            if output_path.suffix.lower() == ".mp4"
            else "audio"
        )

        print("✅ Processing Complete")
        print(f"Output File : {output_filename}")
        print(f"Media Type  : {media_type}")
        print(f"Elapsed     : {elapsed} sec")
        print("=" * 70 + "\n")

        return {
            "message": "Media processed successfully",
            "input_file": request.filename,
            "output_file": output_filename,
            "download_url": f"http://localhost:8000/outputs/{output_filename}",
            "media_type": media_type,
            "processing_time": elapsed,
        }

    except Exception as e:
        print("❌ Processing Failed")
        print(str(e))
        print("=" * 70 + "\n")

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )