import edge_tts
import uuid
import os

# Folder where audio files will be saved
STATIC_DIR = "static"

# Make sure folder exists
os.makedirs(STATIC_DIR, exist_ok=True)


async def text_to_speech(text: str) -> str:
    try:
        # unique filename
        filename = f"voice_{uuid.uuid4()}.mp3"
        file_path = os.path.join(STATIC_DIR, filename)

        # Edge TTS engine
        communicate = edge_tts.Communicate(
            text=text,
            voice="en-US-JennyNeural"  # best natural voice
        )

        # save audio file
        await communicate.save(file_path)

        # return public URL (FastAPI static must be mounted)
        return f"/static/{filename}"

    except Exception as e:
        raise Exception(f"TTS failed: {str(e)}")