from pydantic import BaseModel
from typing import Any,Optional
from fastapi.responses import JSONResponse

class APIResponseModel(BaseModel):
    statusCode : int
    success : bool
    message : str
    data : Optional[Any] = None

def APIResponse(statusCode:int = 200,success:bool = True,message:str = "Success",data:Any = None):
    response = APIResponseModel(
        statusCode=statusCode,
        success=success,
        message=message,
        data=data
    )

    return JSONResponse(status_code=statusCode, content=response.dict())


