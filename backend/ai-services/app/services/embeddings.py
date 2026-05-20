from functools import lru_cache
from langchain_huggingface import HuggingFaceEmbeddings
import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

@lru_cache()
def get_embedding_model():
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en-v1.5",
        # huggingfacehub_api_token=HF_TOKEN
    )

def extract_text(chunk):
    if hasattr(chunk, "page_content"):
        return chunk.page_content
    if isinstance(chunk, dict):
        return chunk.get("page_content") or chunk.get("text", "")
    return str(chunk)

def create_embeddings(chunks):
    if not chunks:
        return []

    model = get_embedding_model()
    texts = [extract_text(c) for c in chunks]

    vectors = model.embed_documents(texts)

    if len(vectors) != len(texts):
        raise ValueError("Embedding mismatch")

    return [[float(x) for x in v] for v in vectors]