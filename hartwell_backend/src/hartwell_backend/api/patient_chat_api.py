from fastapi import APIRouter, HTTPException, Depends

from hartwell_backend.schemas import PatientChatRequest, PatientChatResponse
from hartwell_backend.services import PatientChatService
from hartwell_backend.api.deps import require_role


router = APIRouter(prefix="/patients/chat", tags=["Patient Chat"])

service = PatientChatService()


@router.post("", response_model=PatientChatResponse)
def chat(request: PatientChatRequest, current_user=Depends(require_role("patient"))):
    try:
        if request.conversation_id is None:
            conversation, message = service.start_conversation(patient_id=int(current_user["sub"]), message=request.message)
        else:
            conversation, message = service.continue_conversation(conversation_id=request.conversation_id, message=request.message)

        return PatientChatResponse(conversation_id=conversation.conversation_id, patient_id=conversation.owner_id, message=message.content)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))