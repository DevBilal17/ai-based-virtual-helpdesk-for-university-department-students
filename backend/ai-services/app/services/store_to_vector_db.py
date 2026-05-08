import uuid
import chromadb

def get_chroma_client():
    return chromadb.PersistentClient(path="chroma_db")

def get_or_create_collection(client, name="university_docs"):
    # Using 'cosine' space is usually better for sentence-transformers
    return client.get_or_create_collection(
        name=name, 
        metadata={"hnsw:space": "cosine"} 
    )

def store_embeddings(chunks, embeddings, file_name, mongo_id=None):
    client = get_chroma_client()
    collection = get_or_create_collection(client)
    
    ids = [str(uuid.uuid4()) for _ in chunks]

    # Enhanced Metadata
    metadatas = [
        {
            "source": file_name,
            "mongo_id": str(mongo_id) if mongo_id else "N/A",
            "chunk_index": i
        }
        for i in range(len(chunks))
    ]

    # Critical Check: Ensure chunks are strings for the raw client
    text_documents = [c.page_content if hasattr(c, 'page_content') else c for c in chunks]

    collection.add(
        documents=text_documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )
    print(f"Successfully stored {len(ids)} chunks for {file_name}")
    return len(ids)