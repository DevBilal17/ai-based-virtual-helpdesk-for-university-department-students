from app.services.upload_service import save_upload_file
from app.utils.response import APIResponse
from app.services.file_reading import read_file
from app.services.text_splitting import split_text
from app.services.embeddings import create_embeddings
from app.services.store_to_vector_db import store_embeddings
async def upload_file_controller(file):
    try:
        result = await save_upload_file(file)

        file_path = result.get("filePath")  

        print("File saved at:", file_path)

        file_content = read_file(file_path) 

        file_extension = result.get("extension")

        file_chunks = ""

        if(file_extension == ".txt"):
            file_chunks = split_text(file_content[0].page_content)
        else:
            file_chunks = split_text(file_content)

        embeddings = create_embeddings(file_chunks)

        chunk_count = store_embeddings(file_chunks, embeddings, result.get("fileName"))

        return APIResponse(
            statusCode=201, # 201 is the standard HTTP code for "Created"
            success=True,
            message="Document indexed successfully",
            data={
                "fileName": result.get("fileName"),
                "totalChunks": chunk_count, # Show how many pieces the AI broke the file into
                "status": "active"
            }
        )

    except Exception as e:
        return APIResponse(
            statusCode=500,
            success=False,
            message=str(e)
        )
  

        