from fastapi import APIRouter, HTTPException

from hartwell_backend.schemas import DoctorChatRequest, DoctorChatResponse
from hartwell_backend.services import DoctorChatService


router = APIRouter(prefix="/doctors/chat", tags=["Doctor Chat"])

service = DoctorChatService()


@router.post("", response_model=DoctorChatResponse)
def chat(request: DoctorChatRequest):
    try:
        if request.conversation_id is None:
            if request.doctor_id is None:
                raise HTTPException(status_code=400, detail="doctor_id is required for a new conversation")

            conversation, message = service.start_conversation(doctor_id=request.doctor_id, message=request.message)
        else:
            conversation, message = service.continue_conversation(conversation_id=request.conversation_id, message=request.message)

        return DoctorChatResponse(conversation_id=conversation.conversation_id, doctor_id=conversation.owner_id, message=message.content)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))