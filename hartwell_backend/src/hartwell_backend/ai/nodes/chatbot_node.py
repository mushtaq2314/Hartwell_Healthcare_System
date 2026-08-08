from langchain_core.messages import SystemMessage
from langchain_ollama import ChatOllama
from langgraph.prebuilt import ToolNode

from hartwell_backend.ai.prompts import build_patient_prompt


def create_chatbot_node(patient_id: int, tool_node: ToolNode):

    tools = tool_node.tools_by_name.values()
    
    llm = ChatOllama(
        model="qwen3.5:4b",
        temperature=0,
    ).bind_tools(tools)

    def chatbot_node(state):

        messages = [
            SystemMessage(content=build_patient_prompt(patient_id)),
            *state["messages"],
        ]

        response = llm.invoke(messages)

        return {
            "messages": [response]
        }

    return chatbot_node