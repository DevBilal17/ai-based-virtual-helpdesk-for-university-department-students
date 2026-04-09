from fastapi import FastAPI
from app.utils.response import APIResponse
from app.routes.document_routes import router as document_router
from app.routes.query_routes import router as query_router
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

app.include_router(document_router, prefix="/documents", tags=["documents"])
app.include_router(query_router, prefix="/query", tags=["query"])

@app.get("/")
async def root():
    return APIResponse(statusCode=200,success=True,message="Hello World")