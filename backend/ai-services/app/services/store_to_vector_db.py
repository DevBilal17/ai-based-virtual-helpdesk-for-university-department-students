import uuid
import chromadb
from functools import lru_cache

def get_chroma_client():
    print("[DEBUG] Creating Chroma client...")
    client = chromadb.PersistentClient(path="chroma_db")
    print("[DEBUG] Chroma client ready")
    return client


@lru_cache()
def get_collection():
    print("[DEBUG] Fetching/creating collection...")
    client = get_chroma_client()

    collection = client.get_or_create_collection(
        name="university_docs",
        metadata={"hnsw:space": "cosine"}
    )

    print("[DEBUG] Collection loaded:", collection.name)
    return collection


def extract_text(c):
    print("[DEBUG] Extracting text from chunk...")

    if hasattr(c, "page_content"):
        text = c.page_content
        print("[DEBUG] Found page_content")
        return text

    if isinstance(c, dict):
        text = c.get("page_content") or c.get("text", "")
        print("[DEBUG] Found dict chunk")
        return text

    text = str(c)
    print("[DEBUG] Fallback string conversion")
    return text


def store_embeddings(chunks, embeddings, file_name, mongo_id=None):

    print("\n================ STORE EMBEDDINGS START ================")
    print("[DEBUG] File:", file_name)
    print("[DEBUG] Total chunks:", len(chunks))
    print("[DEBUG] Total embeddings:", len(embeddings))

    if not chunks:
        print("[DEBUG] No chunks found -> returning 0")
        return 0

    text_documents = [extract_text(c) for c in chunks]

    print("[DEBUG] Sample chunk text:", text_documents[0][:100] if text_documents else "EMPTY")

    if len(text_documents) != len(embeddings):
        print("[ERROR] Mismatch detected!")
        print("[DEBUG] texts:", len(text_documents))
        print("[DEBUG] embeddings:", len(embeddings))
        raise ValueError("Chunks and embeddings length mismatch")

    collection = get_collection()

    ids = [str(uuid.uuid4()) for _ in range(len(chunks))]

    print("[DEBUG] Generated IDs:", ids[:5])

    metadatas = [
        {
            "source": file_name,
            "chunk_index": i,
            "text": text_documents[i][:200],
            **({"mongo_id": mongo_id} if mongo_id is not None else {})
        }
        for i in range(len(chunks))
    ]

    print("[DEBUG] Metadata sample:", metadatas[0] if metadatas else None)

    print("[DEBUG] Adding to ChromaDB...")

    collection.add(
        documents=text_documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    print(f"[SUCCESS] Stored {len(ids)} chunks for {file_name}")
    print("================ STORE EMBEDDINGS END ================\n")

    return len(ids)