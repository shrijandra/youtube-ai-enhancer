from pydantic import BaseModel


class EnhancementSettings(BaseModel):
    noiseReduction: int = 50
    voiceClarity: int = 50
    echoRemoval: int = 50
    loudness: int = 50

    # V3.1 - Baby/background vocal suppression
    babyNoiseSuppression: bool = False
    babyNoiseStrength: int = 70

    # V3.2 - Keyboard/mouse click suppression
    # Defaults on: the clarity EQ and makeup gain amplify click
    # transients, so this has to be opted out of, not into.
    clickNoiseSuppression: bool = True
    clickNoiseStrength: int = 60


class ProcessRequest(BaseModel):
    filename: str
    settings: EnhancementSettings