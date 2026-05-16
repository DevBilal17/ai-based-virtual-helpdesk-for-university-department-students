from functools import lru_cache
from langchain_huggingface import HuggingFaceEmbeddings

@lru_cache()
def get_embedding_model():
    # This model is local, fast, and free.
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

def create_embeddings(chunks):
    # In a standard LangChain flow, we pass the MODEL to the vector store.
    # However, if you want to see the vectors for debugging:
    model = get_embedding_model()
    
    # If chunks are LangChain Documents, we need to extract page_content
    if hasattr(chunks[0], 'page_content'):
        texts = [doc.page_content for doc in chunks]
    else:
        texts = chunks
        
    vectors = model.embed_documents(texts)
    return vectors