from langchain_core.messages import HumanMessage

from hartwell_backend.ai.agents import PatientAgentFactory

patient_agent = PatientAgentFactory.create_patient_agent(6)

user = str(input("User: "))

response = patient_agent.invoke(
    {
        "messages": [
            HumanMessage(
                content=user
            )
        ]
    }
)

print(response["messages"][-1].content)