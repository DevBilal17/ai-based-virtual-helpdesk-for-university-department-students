from fastapi import FastAPI
from app.utils.response import APIResponse
from app.routes.document_routes import router as document_router
from app.routes.query_routes import router as query_router
from chromadb import PersistentClient
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()
client = PersistentClient(path="./chroma_db")
app.include_router(document_router, prefix="/documents", tags=["documents"])
app.include_router(query_router, prefix="/query", tags=["query"])


@app.delete("/vector/delete-collection")
def delete_collection(collection_name: str):
    try:
        client.delete_collection(name=collection_name)

        return {
            "success": True,
            "message": f"Collection '{collection_name}' deleted successfully"
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
    
    
@app.get("/")
async def root():
    return APIResponse(statusCode=200,success=True,message="Hello World")