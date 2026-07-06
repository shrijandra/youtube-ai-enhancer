from pydantic import BaseModel


class EnhancementSettings(BaseModel):
    noiseReduction: int = 50
    voiceClarity: int = 50
    echoRemoval: int = 50
    loudness: int = 50


class ProcessRequest(BaseModel):
    filename: str
    settings: EnhancementSettings