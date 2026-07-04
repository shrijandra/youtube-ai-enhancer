from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.process import router as process_router

app = FastAPI(
    title="AI Creator Studio API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(process_router)

@app.get("/")
def root():
    return {"message": "AI Creator Studio Backend Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}