import os
import json
from app.utils.response import APIResponse
from app.utils.text_intelligence import normalize_text
from app.services.text_splitting import split_text
from app.services.embeddings import create_embeddings
from app.services.store_to_vector_db import store_embeddings


async def upload_json_folder_controller(folder_path: str):
    try:
        all_texts = []

        # 1️⃣ Read all JSON files from folder
        for filename in os.listdir(folder_path):
            if filename.endswith(".json"):
                file_path = os.path.join(folder_path, filename)

                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                print(f"Reading: {filename}")

                # 2️⃣ Convert JSON → text
                if isinstance(data, dict):
                    text = " ".join([f"{k}: {v}" for k, v in data.items()])
                elif isinstance(data, list):
                    text = " ".join([str(item) for item in data])
                else:
                    text = str(data)

                all_texts.append(text)

        # 3️⃣ Merge all files into one corpus
        full_text = " ".join(all_texts)

        # 4️⃣ Normalize
        full_text = normalize_text(full_text)

        # 5️⃣ Split into chunks
        chunks = split_text(full_text)

        # 6️⃣ Clean chunks
        clean_chunks = [normalize_text(c) for c in chunks]

        # 7️⃣ Embeddings
        embeddings = create_embeddings(clean_chunks)

        # 8️⃣ Store in vector DB
        chunk_count = store_embeddings(
            clean_chunks,
            embeddings,
            file_name="json_folder_ingestion"
        )

        return APIResponse(
            statusCode=201,
            success=True,
            message="Folder JSON indexed successfully",
            data={
                "filesProcessed": len([f for f in os.listdir(folder_path) if f.endswith(".json")]),
                "totalChunks": chunk_count,
                "status": "active"
            }
        )

    except Exception as e:
        return APIResponse(
            statusCode=500,
            success=False,
            message=str(e)
        )