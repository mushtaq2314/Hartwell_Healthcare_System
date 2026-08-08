from dataclasses import dataclass, field
from uuid import UUID, uuid4

from langchain_core.messages import BaseMessage


@dataclass
class ConversationRegistry:
    conversation_id: UUID
    patient_id: int
    chat_history: list[BaseMessage] = field(default_factory=list)


class ConversationManager:

    def __init__(self):
        self._conversations: dict[UUID, ConversationRegistry] = {}

    def create(self, patient_id: int) -> ConversationRegistry:
        conversation = ConversationRegistry(conversation_id=uuid4(), patient_id=patient_id)
        self._conversations[conversation.conversation_id] = conversation

        return conversation

    def get(self, conversation_id: UUID) -> ConversationRegistry | None:
        return self._conversations.get(conversation_id)

    def delete(self, conversation_id: UUID) -> bool:
        return self._conversations.pop(conversation_id,None) is not None