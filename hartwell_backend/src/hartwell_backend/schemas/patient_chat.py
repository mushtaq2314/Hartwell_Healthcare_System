from uuid import UUID

from pydantic import BaseModel


class PatientChatRequest(BaseModel):
    patient_id: int | None = None
    conversation_id: UUID | None = None
    message: str


class PatientChatResponse(BaseModel):
    conversation_id: UUID
    patient_id: int
    message: str