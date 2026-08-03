# schemas/timeline_event.py
from datetime import datetime

from pydantic import BaseModel


class TimelineEventBase(BaseModel):
    patient_id: int
    visit_id: int | None = None
    event_type: str
    title: str
    description: str | None = None


class TimelineEventCreate(TimelineEventBase):
    pass


class TimelineEventResponse(TimelineEventBase):
    id: int
    event_time: datetime

    class Config:
        from_attributes = True