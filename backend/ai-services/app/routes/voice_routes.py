from app.utils.intent_router import detect_intent
from app.controllers.query_controllers import process_query_core
from app.services.whisper_service import WhisperService
from app.services.tts_service import text_to_speech

from fastapi import APIRouter, UploadFile, File

router = APIRouter()


def clean_text(text: str):
    return text.strip()


@router.post("/process")
async def voice_controller(file: UploadFile = File(...)):
    try:

        # 1. Speech → Text
        result = await WhisperService.transcribe_audio(file)
        text = clean_text(result.get("transcription", ""))

        if not text:
            return {"error": "Empty transcription"}

        # 2. INTENT FIRST (IMPORTANT FIX)
        intent = detect_intent(text)

        # 3. ROUTING LOGIC
        if intent == "greeting":
            answer = "Hello! I am your AI IT Help Desk. How can I help you?"

        elif intent == "developer":
            answer = (
                "This system is developed by Muhammad Bilal Aqeel, "
                "Team Lead, and Abdul Waleed, both BSCS 8th semester students."
            )

        else:
            # 4. NORMAL RAG FLOW
            ai_result = await process_query_core(text)
            answer = ai_result["answer"]["answer"]

        # 5. TTS
        audio_url = await text_to_speech(answer)

        return {
            "success": True,
            "data": {
                "transcription": text,
                "intent": intent,
                "reply": answer,
                "audio_url": audio_url
            }
        }

    except Exception as e:
        return {"success": False, "message": str(e)}