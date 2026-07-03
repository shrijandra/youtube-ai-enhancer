from fastapi import FastAPI
from app.api.upload import router as upload_router

app = FastAPI(
    title="AI Creator Studio API",
    version="1.0.0",
)

app.include_router(upload_router)


@app.get("/")
def root():
    return {
        "message": "AI Creator Studio Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }