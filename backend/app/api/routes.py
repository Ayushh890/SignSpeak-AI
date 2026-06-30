from fastapi import APIRouter
from app.models.schemas import TranslationRequest, TranslationResponse
from app.services.translation import translate_text

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    translated = translate_text(
        request.text, request.source_language, request.target_language
    )
    return TranslationResponse(
        original_text=request.text,
        translated_text=translated,
        source_language=request.source_language,
        target_language=request.target_language,
    )


@router.get("/languages")
async def list_languages():
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "hi", "name": "Hindi"},
            {"code": "fr", "name": "French"},
            {"code": "es", "name": "Spanish"},
            {"code": "ja", "name": "Japanese"},
            {"code": "de", "name": "German"},
            {"code": "pt", "name": "Portuguese"},
            {"code": "ar", "name": "Arabic"},
        ]
    }
