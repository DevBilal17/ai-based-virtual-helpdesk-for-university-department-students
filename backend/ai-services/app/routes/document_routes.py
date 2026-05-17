from fastapi import APIRouter, File, UploadFile
from app.utils.response import APIResponse
from app.controllers.document_controllers import upload_file_controller
from app.controllers.upload_json_folder_controller import upload_json_folder_controller
import os
router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return await upload_file_controller(file)



@router.post("/ingest-json-folder")
async def ingest_json_folder():
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path =os.path.join(BASE_DIR, "data", "json") 

    return await upload_json_folder_controller(folder_path)