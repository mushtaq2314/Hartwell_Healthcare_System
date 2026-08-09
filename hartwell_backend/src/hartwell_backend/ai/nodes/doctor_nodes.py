from langchain_core.messages import SystemMessage
from langchain_ollama import ChatOllama
from langgraph.prebuilt import ToolNode

from hartwell_backend.ai.prompts import build_doctor_prompt
from hartwell_backend.ai.tools.doctor_tools import (
    create_comparison_tool,
    create_doctor_context_tool,
    create_medical_history_tool,
    create_medication_tool,
    create_patient_profile_tool,
    create_report_tool,
    create_timeline_tool,
)


def create_doctor_tools(doctor_id: int):
    return [
        create_doctor_context_tool(doctor_id),
        create_patient_profile_tool(doctor_id),
        create_medical_history_tool(doctor_id),
        create_report_tool(doctor_id),
        create_medication_tool(doctor_id),
        create_timeline_tool(doctor_id),
        create_comparison_tool(doctor_id),
    ]


def create_tool_node(doctor_id: int):
    tools = create_doctor_tools(doctor_id)
    return ToolNode(tools)


def create_chatbot_node(doctor_id: int, tool_node: ToolNode):
    tools = tool_node.tools_by_name.values()

    llm = ChatOllama(model="qwen3.5:4b", temperature=0).bind_tools(tools)

    def chatbot_node(state):
        messages = [SystemMessage(content=build_doctor_prompt()), *state["messages"]]

        response = llm.invoke(messages)

        return {"messages": [response]}

    return chatbot_node