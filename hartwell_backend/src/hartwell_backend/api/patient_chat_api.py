from fastapi import APIRouter, HTTPException

from hartwell_backend.services import PatientChatService
from hartwell_backend.schemas.patient_chat import PatientChatRequest, PatientChatResponse


router = APIRouter(
    prefix="/patients/chat",
    tags=["Patient Chat"],
)

service = PatientChatService()


@router.post("", response_model=PatientChatResponse)
def chat(request: PatientChatRequest):
    try:
        if request.conversation_id is None:
            if request.patient_id is None:
                raise HTTPException(
                    status_code=400,
                    detail="patient_id is required for a new conversation",
                )

            conversation, message = service.start_conversation(
                patient_id=request.patient_id,
                message=request.message,
            )

        else:
            conversation, message = service.continue_conversation(
                conversation_id=request.conversation_id,
                message=request.message,
            )

        return PatientChatResponse(
            conversation_id=conversation.conversation_id,
            patient_id=conversation.patient_id,
            message=message.content,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )