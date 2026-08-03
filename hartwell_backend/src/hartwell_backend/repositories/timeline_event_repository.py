# repositories/timeline_event_repository.py
from sqlalchemy.orm import Session

from hartwell_backend.models import TimelineEvent
from hartwell_backend.schemas import TimelineEventCreate


class TimelineEventRepository:

    def create(self, db: Session, event: TimelineEventCreate) -> TimelineEvent:
        db_event = TimelineEvent(**event.model_dump())
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return db_event

    def find_by_patient(self, db: Session, patient_id: int):
        return db.query(TimelineEvent).filter(
            TimelineEvent.patient_id == patient_id
        ).order_by(TimelineEvent.event_time.desc()).all()