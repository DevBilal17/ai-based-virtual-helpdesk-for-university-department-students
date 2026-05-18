import json

from app.utils.intent_router import detect_intent
from app.controllers.query_controllers import process_query_core
from app.services.whisper_service import WhisperService
from app.services.tts_service import text_to_speech
from pydantic import BaseModel
from fastapi import APIRouter, UploadFile, File, Form

router = APIRouter()


def clean_text(text: str):
    return text.strip()

# -----------------------------
# Request Schema
# -----------------------------
class TextRequest(BaseModel):
    query: str
    use_internet: bool = False
    chat_history: list = []
@router.post("/query/process")
async def process_text(request: TextRequest):
    try:

        text = request.query.strip()

        if not text:
            return {
                "success": False,
                "message": "Empty query"
            }

        # 1. Intent Detection
        intent = detect_intent(text)

        ai_result = None
        rag_data = {}

        # 2. Routing Logic (SAME AS VOICE)
        if intent == "greeting":
            answer = "Hello! I am your AI IT Help Desk. How can I help you?"

        elif intent == "developer":
            answer = (
                "This system is developed by Muhammad Bilal Aqeel, "
                "Team Lead, and Abdul Waleed, both BSCS 8th semester students."
            )

        else:
            # 3. RAG / Internet Hybrid Layer
            ai_result = await process_query_core(
                text,
                use_internet=request.use_internet,
                   chat_history=request.chat_history   
            )

            rag_data = ai_result["answer"]
            answer = rag_data["answer"]

        # 4. TTS (same as voice)
        audio_url = await text_to_speech(answer)

        # 5. EXACT SAME RESPONSE STRUCTURE AS VOICE
        return {
            "success": True,
            "data": {
                "transcription": text,
                "reply": answer,
                "audio_url": audio_url,

                # RAG metadata (same as voice)
                "found_in_context": rag_data.get("found_in_context", True),
                "needs_internet": rag_data.get("needs_internet", False),

                "officeNodeId": rag_data.get("officeNodeId"),
                "doorNodeId": rag_data.get("doorNodeId"),

                "intent": rag_data.get("intent"),
                "matched_person": rag_data.get("matched_person"),

                "publications_count": rag_data.get("publications_count"),

                "sources": ai_result.get("sources", []) if ai_result else []
            }
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@router.post("/process")
async def voice_controller(file: UploadFile = File(...), chat_history: str = Form(None)):
    try:

        # 1. Speech → Text
        result = await WhisperService.transcribe_audio(file)
        text = clean_text(result.get("transcription", ""))
        if chat_history:
            chat_history = json.loads(chat_history)
        else:
            chat_history = []
        if not text:
            return {"error": "Empty transcription"}

        # 2. Detect Intent
        intent = detect_intent(text)

        ai_result = None
        rag_data = {}

        # 3. Routing
        if intent == "greeting":
            answer = "Hello! I am your AI IT Help Desk. How can I help you?"

        elif intent == "developer":
            answer = (
                "This system is developed by Muhammad Bilal Aqeel, "
                "Team Lead, and Abdul Waleed, both BSCS 8th semester students."
            )

        else:
            ai_result = await process_query_core(text, chat_history=chat_history)

            rag_data = ai_result["answer"]

            answer = rag_data["answer"]

        # 4. TTS
        audio_url = await text_to_speech(answer)

        return {
            "success": True,
            "data": {
                "transcription": text,
                "reply": answer,
                "audio_url": audio_url,

                # RAG Metadata
                "found_in_context": rag_data.get("found_in_context", True),
                "needs_internet": rag_data.get("needs_internet", False),

                "officeNodeId": rag_data.get("officeNodeId"),
                "doorNodeId": rag_data.get("doorNodeId"),

                "intent": rag_data.get("intent"),
                "matched_person": rag_data.get("matched_person"),

                "publications_count": rag_data.get("publications_count"),

                "sources": ai_result.get("sources", []) if ai_result else []
            }
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }