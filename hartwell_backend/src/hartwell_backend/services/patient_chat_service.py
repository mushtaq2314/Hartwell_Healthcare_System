from uuid import UUID

from langchain_core.messages import HumanMessage

from hartwell_backend.ai.agents import PatientAgentFactory
from hartwell_backend.ai.conversation import conversation_manager


class PatientChatService:
    def start_conversation(self, patient_id: int, message: str):
        conversation = conversation_manager.create(patient_id)

        agent = PatientAgentFactory.create_patient_agent(
            conversation.patient_id
        )

        conversation.chat_history.append(
            HumanMessage(content=message)
        )

        response = agent.invoke(
            {
                "messages": conversation.chat_history,
            }
        )

        conversation.chat_history = response["messages"]

        return conversation, response["messages"][-1]

    def continue_conversation(self, conversation_id: UUID, message: str):
        conversation = conversation_manager.get(conversation_id)

        if conversation is None:
            raise ValueError("Conversation not found")

        agent = PatientAgentFactory.create_patient_agent(
            conversation.patient_id
        )

        conversation.chat_history.append(
            HumanMessage(content=message)
        )

        response = agent.invoke(
            {
                "messages": conversation.chat_history,
            }
        )

        conversation.chat_history = response["messages"]

        return conversation, response["messages"][-1]