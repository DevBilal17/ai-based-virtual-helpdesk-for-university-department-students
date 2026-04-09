from fastapi import APIRouter, File, UploadFile
from app.utils.response import APIResponse
from app.controllers.document_controllers import upload_file_controller
router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return await upload_file_controller(file)

