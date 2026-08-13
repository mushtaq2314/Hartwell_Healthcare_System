from uuid import UUID

from pydantic import BaseModel


class DoctorChatRequest(BaseModel):
    conversation_id: UUID | None = None
    message: str


class DoctorChatResponse(BaseModel):
    conversation_id: UUID
    doctor_id: int
    message: str