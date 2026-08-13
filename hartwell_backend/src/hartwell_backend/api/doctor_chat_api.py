from fastapi import APIRouter, HTTPException, Depends

from hartwell_backend.schemas import DoctorChatRequest, DoctorChatResponse
from hartwell_backend.services import DoctorChatService
from hartwell_backend.api.deps import require_role

router = APIRouter(prefix="/doctors/chat", tags=["Doctor Chat"])

service = DoctorChatService()


@router.post("", response_model=DoctorChatResponse)
def chat(request: DoctorChatRequest, current_user=Depends(require_role("doctor"))):
    try:
        if request.conversation_id is None:
            conversation, message = service.start_conversation(doctor_id=current_user["sub"], message=request.message)
        else:
            conversation, message = service.continue_conversation(conversation_id=request.conversation_id, message=request.message)

        return DoctorChatResponse(conversation_id=conversation.conversation_id, doctor_id=conversation.owner_id, message=message.content)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))