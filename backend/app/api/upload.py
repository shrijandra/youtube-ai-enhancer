from pathlib import Path
import shutil
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile, HTTPException
from app.core.config import UPLOAD_DIR

router = APIRouter()

'''UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)'''


ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".flac",
    ".m4a",
    ".mp4",
    ".mov",
    ".mkv",
}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type",
        )

    filename = f"{uuid4()}{extension}"

    destination = UPLOAD_DIR / filename

    with destination.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": filename,
        "original_name": file.filename,
        "content_type": file.content_type,
        "size": destination.stat().st_size,
        "message": "Upload successful",
    }