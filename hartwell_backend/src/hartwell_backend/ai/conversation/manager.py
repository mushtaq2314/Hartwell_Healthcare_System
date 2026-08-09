from dataclasses import dataclass, field
from enum import Enum
from uuid import UUID, uuid4

from langchain_core.messages import BaseMessage


class ConversationOwnerType(str, Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"


@dataclass
class ConversationRegistry:
    conversation_id: UUID
    owner_type: ConversationOwnerType
    owner_id: int
    chat_history: list[BaseMessage] = field(default_factory=list)


class ConversationManager:
    def __init__(self):
        self._conversations: dict[UUID, ConversationRegistry] = {}

    def create(self, owner_type: ConversationOwnerType, owner_id: int) -> ConversationRegistry:
        conversation = ConversationRegistry(conversation_id=uuid4(), owner_type=owner_type, owner_id=owner_id)
        self._conversations[conversation.conversation_id] = conversation
        return conversation

    def get(self, conversation_id: UUID) -> ConversationRegistry | None:
        return self._conversations.get(conversation_id)

    def get_by_owner(self, owner_type: ConversationOwnerType, owner_id: int) -> list[ConversationRegistry]:
        return [conversation for conversation in self._conversations.values() if conversation.owner_type == owner_type and conversation.owner_id == owner_id]

    def delete(self, conversation_id: UUID) -> bool:
        return self._conversations.pop(conversation_id, None) is not None


conversation_manager = ConversationManager()