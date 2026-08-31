from typing import Any, Optional
from pydantic import BaseModel


class ApiResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error: Optional[str] = None
