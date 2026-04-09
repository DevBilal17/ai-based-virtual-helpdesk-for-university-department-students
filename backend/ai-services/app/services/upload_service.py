import os

from fastapi import UploadFile,HTTPException

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload_file(file: UploadFile):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        return {
            "fileName": file.filename,
            "filePath": file_path,
            "extension": os.path.splitext(file.filename)[1],
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Failed to save file: {str(e)}")