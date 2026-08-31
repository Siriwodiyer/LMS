from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class AssessmentSubmitRequest(BaseModel):
    userId: Optional[str] = None
    answers: Dict[str, int]  # question index or id -> selected option index
    customQuestions: Optional[List[Dict[str, Any]]] = None
