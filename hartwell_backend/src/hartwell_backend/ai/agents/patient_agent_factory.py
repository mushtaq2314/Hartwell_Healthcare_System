from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import tools_condition

from hartwell_backend.ai.state import PatientState
from hartwell_backend.ai.nodes import create_chatbot_node
from hartwell_backend.ai.nodes import create_tool_node

class PatientAgentFactory:
    def create_patient_agent(patient_id: int):

        tool_node = create_tool_node(patient_id)

        chatbot_node = create_chatbot_node(patient_id, tool_node)

        builder = StateGraph(PatientState)

        builder.add_node("chatbot", chatbot_node)
        builder.add_node("tools", tool_node)

        builder.add_edge(START, "chatbot")

        builder.add_conditional_edges(
            "chatbot",
            tools_condition,
        )

        builder.add_edge("tools", "chatbot")

        builder.add_edge("chatbot", END)

        return builder.compile()