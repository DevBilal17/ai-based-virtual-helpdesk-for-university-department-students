from app.services.upload_service import save_upload_file
from app.utils.response import APIResponse
from app.services.file_reading import read_file
from app.services.text_splitting import split_text
from app.services.embeddings import create_embeddings
from app.services.store_to_vector_db import store_embeddings
from app.utils.text_intelligence import normalize_text
async def upload_file_controller(file):
    try:
        result = await save_upload_file(file)

        file_path = result.get("filePath")  

        print("File saved at:", file_path)

        file_content = read_file(file_path)

        print("File Content at 1:",file_content)

        if isinstance(file_content, list):
            file_content = " ".join([str(x.page_content) for x in file_content])
        print("File Content at 2:",file_content)
        # 🔥 NORMALIZE FULL TEXT
        file_content = normalize_text(file_content)
        print("File Content at 3:",file_content)
        # 🔥 CHUNK
        file_chunks = split_text(file_content)
        print("File Chunks at:",file_chunks)
        # 🔥 NORMALIZE CHUNKS (VERY IMPORTANT)
        clean_chunks = [normalize_text(c) for c in file_chunks]
        print("File Chunks at:",file_chunks)
        # 🔥 EMBEDDINGS
        embeddings = create_embeddings(clean_chunks)
        print("File Embeddings at:", embeddings)
        # 🔥 STORE
        chunk_count = store_embeddings(
            clean_chunks,
            embeddings,
            result.get("fileName")
        )
        print("File Chunks Count at:", chunk_count)
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
  

        