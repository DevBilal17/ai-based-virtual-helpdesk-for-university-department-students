import uuid
import chromadb

#Get Chroma Client
def get_chroma_client():
    return chromadb.PersistentClient(path="chroma_db")

#Create or Get Collection
def get_or_create_collection(client,name="university_docs"):
    # client = chromadb.PersistentClient(path="chroma_db")
    return client.get_or_create_collection(name=name)

#Store Embeddings
def store_embeddings(chunks, embeddings, file_name):
    client = get_chroma_client()
    collection = get_or_create_collection(client)
    ids = [str(uuid.uuid4()) for _ in chunks]

    metadatas = [
        {
            "source": file_name,
            "chunk_index": i,
            "length": len(chunks[i])
        }
        for i in range(len(chunks))
    ]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )
