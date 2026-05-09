import os
import time
import shutil
from faster_whisper import WhisperModel

# Model Load (Global logic like a singleton)
model_size = "base"
model = WhisperModel(model_size, device="cpu", compute_type="int8")

class WhisperService:
    @staticmethod
    async def transcribe_audio(file):
        temp_path = f"temp_{int(time.time())}_{file.filename}"
        
        try:
            # Save file
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Transcribe
            segments, info = model.transcribe(temp_path, beam_size=5)
            transcribed_text = " ".join([segment.text for segment in segments]).strip()

            # Cleanup
            os.remove(temp_path)
            
            return {
                "transcription": transcribed_text,
                "language": info.language,
                "reply": f"Processed AI response for: {transcribed_text}"
            }
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise e