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

     
        # 🔥 CHUNK
        # ALWAYS DOCUMENT LIST NOW
        file_chunks = split_text(file_content)
        
        print("File Chunks at:",file_chunks)
        # 🔥 NORMALIZE CHUNKS (VERY IMPORTANT)
        texts = [
            normalize_text(c.page_content)
            for c in file_chunks
            if c.page_content and c.page_content.strip()
        ]
        print("File Chunks at:",file_chunks)
        # 🔥 EMBEDDINGS
        print("🔵 STEP: chunks count =", len(texts))
        print("🔵 STEP: chunks sample =", texts[:1])

        embeddings = create_embeddings(texts)

        print("🟡 STEP: embeddings type =", type(embeddings))
        print("🟡 STEP: embeddings length =", len(embeddings) if embeddings else 0)
        # 🔥 STORE
        print("🔵 embeddings type:", type(embeddings))
        print("🔵 embeddings length:", len(embeddings))
        print("🔵 first embedding sample:", embeddings[0][:5])
        print("🔵 chunks length:", len(texts))
        chunk_count = store_embeddings(
            texts,
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
  

        