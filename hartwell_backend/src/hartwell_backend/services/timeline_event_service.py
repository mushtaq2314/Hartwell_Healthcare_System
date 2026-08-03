# services/timeline_event_service.py
from sqlalchemy.orm import Session

from hartwell_backend.repositories import PatientRepository, TimelineEventRepository


class TimelineEventService:

    def __init__(self):
        self.repository = TimelineEventRepository()
        self.patient_repository = PatientRepository()

    def get_timeline_for_patient(self, db: Session, patient_id: int):
        if not self.patient_repository.find_by_id(db, patient_id):
            raise ValueError("Patient not found")
        return self.repository.find_by_patient(db, patient_id)