from fastapi import APIRouter
from pydantic import BaseModel
from app.controllers.query_controllers import query_controller

router = APIRouter()


# Request Body Schema
class QueryRequest(BaseModel):
    query: str


# Route
@router.post("/ask")
async def ask_question(request: QueryRequest):
    return await query_controller(request.query)