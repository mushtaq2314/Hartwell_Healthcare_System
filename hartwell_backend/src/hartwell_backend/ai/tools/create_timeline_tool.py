from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import TimelineEventRepository


repository = TimelineEventRepository()


def create_timeline_tool(current_patient_id: int):
    @tool
    def get_timeline(patient_id: int):
        """
        Returns patient's timeline.
        """
        print("get_timeline tool called")

        if patient_id != current_patient_id:
            return "Access denied."

        db = SessionLocal()

        try:
            events = repository.find_by_patient(
                db,
                patient_id,
            )

            return [
                {
                    "event": event.event_type,
                    "title": event.title,
                    "description": event.description,
                    "timestamp": str(event.event_time),
                }
                for event in events
            ]

        finally:
            db.close()

    return get_timeline