from langgraph.graph import StateGraph, START, END

from langgraph.prebuilt import tools_condition

from hartwell_backend.ai.state import DoctorState

from hartwell_backend.ai.nodes.doctor_nodes import create_tool_node, create_chatbot_node


class DoctorAgentFactory:

    @staticmethod
    def create_doctor_agent(doctor_id: int):

        tool_node = create_tool_node(doctor_id)

        chatbot_node = create_chatbot_node(doctor_id, tool_node)

        builder = StateGraph(DoctorState)

        builder.add_node("chatbot", chatbot_node)

        builder.add_node("tools", tool_node)

        builder.add_edge(START, "chatbot")

        builder.add_conditional_edges("chatbot", tools_condition)

        builder.add_edge("tools", "chatbot")

        builder.add_edge("chatbot", END)

        return builder.compile()