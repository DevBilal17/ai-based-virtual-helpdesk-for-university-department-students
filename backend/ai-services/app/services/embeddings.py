from langchain_huggingface import HuggingFaceEmbeddings



#Get Embedding Model
def get_embedding_model():
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return embedding_model


#Create Embeddings

def create_embeddings(chunks):
    embedding_model = get_embedding_model()
    vectors = embedding_model.embed_documents(chunks)
    return vectors

