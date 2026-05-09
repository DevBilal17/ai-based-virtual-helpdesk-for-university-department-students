from fastapi import APIRouter
from pydantic import BaseModel
from app.controllers.query_controllers import process_query_core
from app.utils.response import APIResponse
router = APIRouter()


# Request Body Schema
class QueryRequest(BaseModel):
    query: str


# Route
@router.post("/ask")
async def ask_question(request: QueryRequest):
    return await query_controller(request.query)



async def query_controller(query: str):
    try:
        result = await process_query_core(query)

        return APIResponse(
            statusCode=200,
            success=True,
            message="Query processed successfully",
            data=result
        )

    except Exception as e:
        return APIResponse(
            statusCode=500,
            success=False,
            message=str(e)
        )