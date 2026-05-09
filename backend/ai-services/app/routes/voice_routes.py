from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.whisper_service import WhisperService
from app.controllers.query_controllers import process_query_core
from app.services.tts_service import text_to_speech

router = APIRouter()


@router.post("/process")
async def voice_controller(file: UploadFile = File(...)):
    print("🔥 VOICE CONTROLLER HIT")

    try:
        print("📥 Step 1: File received")

        print("🎤 Step 2: BEFORE Whisper")

        transcription_result = await WhisperService.transcribe_audio(file)

        print("🧠 AFTER Whisper:", transcription_result)

        transcription = transcription_result["transcription"]

        print("📝 Transcription:", transcription)

        ai_result = await process_query_core(transcription)

        print("🤖 AI DONE:", ai_result)

        answer_text = ai_result["answer"]["answer"]

        print("💬 Answer:", answer_text)

        audio_url = await text_to_speech(answer_text)

        print("🔊 Audio:", audio_url)

        return {
            "success": True,
            "statusCode": 200,
            "data": {
                "transcription": transcription,
                "reply": answer_text,
                "audio_url": audio_url,
                "source" : ai_result["sources"],
                "answer": ai_result["answer"]
            }
        }

    except Exception as e:
        print("❌ FULL ERROR:", repr(e))
        return {
            "success": False,
            "message": str(e),
            "data": None
        }
    