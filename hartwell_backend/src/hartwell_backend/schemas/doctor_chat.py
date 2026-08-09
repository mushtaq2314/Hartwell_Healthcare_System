from uuid import UUID

from pydantic import BaseModel


class DoctorChatRequest(BaseModel):
    doctor_id: int
    conversation_id: UUID | None = None
    message: str


class DoctorChatResponse(BaseModel):
    conversation_id: UUID
    doctor_id: int
    message: str