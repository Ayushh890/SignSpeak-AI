from pydantic import BaseModel


class TranslationRequest(BaseModel):
    text: str
    source_language: str = "en"
    target_language: str = "hi"


class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str


class LandmarkData(BaseModel):
    landmarks: list[list[dict]]
    timestamp: float


class SignDetection(BaseModel):
    sign: str
    confidence: float
    hand: str = "right"
