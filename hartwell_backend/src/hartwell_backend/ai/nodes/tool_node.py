from langgraph.prebuilt import ToolNode

from hartwell_backend.ai.tools import (
    create_patient_profile_tool,
    create_medical_history_tool,
    create_report_tool,
    create_medication_tool,
    create_timeline_tool,
    create_comparison_tool,
    create_doctor_context_tool,
)


def create_tool_node(patient_id: int):

    tools = [
        create_patient_profile_tool(patient_id),
        create_medical_history_tool(patient_id),
        create_report_tool(patient_id),
        create_medication_tool(),
        create_timeline_tool(patient_id),
        create_comparison_tool(),
        create_doctor_context_tool(patient_id),
    ]

    return ToolNode(tools)