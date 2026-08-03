# services/visit_service.py
from sqlalchemy.orm import Session

from hartwell_backend.models import AppointmentStatus
from hartwell_backend.repositories import AppointmentRepository, DoctorRepository, PatientRepository, TimelineEventRepository, VisitRepository
from hartwell_backend.schemas import TimelineEventCreate, VisitCreate, VisitUpdate


class VisitService:

    def __init__(self):
        self.repository = VisitRepository()
        self.patient_repository = PatientRepository()
        self.doctor_repository = DoctorRepository()
        self.appointment_repository = AppointmentRepository()
        self.timeline_repository = TimelineEventRepository()

    def create_visit(self, db: Session, visit: VisitCreate):
        if not self.patient_repository.find_by_id(db, visit.patient_id):
            raise ValueError("Patient not found")
        if not self.doctor_repository.find_by_id(db, visit.doctor_id):
            raise ValueError("Doctor not found")

        appointment = None
        if visit.appointment_id is not None:
            appointment = self.appointment_repository.find_by_id(db, visit.appointment_id)
            if not appointment:
                raise ValueError("Appointment not found")
            if appointment.patient_id != visit.patient_id or appointment.doctor_id != visit.doctor_id:
                raise ValueError("Appointment does not match the given patient and doctor")

        db_visit = self.repository.create(db, visit)

        if appointment is not None:
            self.appointment_repository.set_status(db, appointment.id, AppointmentStatus.COMPLETED)

        self.timeline_repository.create(
            db,
            TimelineEventCreate(
                patient_id=visit.patient_id,
                visit_id=db_visit.id,
                event_type="VISIT_COMPLETED",
                title="Visit Completed",
                description=visit.chief_complaint,
            ),
        )

        return db_visit

    def get_all_visits(self, db: Session):
        return self.repository.find_all(db)

    def get_visit(self, db: Session, visit_id: int):
        visit = self.repository.find_by_id(db, visit_id)
        if not visit:
            raise ValueError("Visit not found")
        return visit

    def get_visits_for_patient(self, db: Session, patient_id: int):
        if not self.patient_repository.find_by_id(db, patient_id):
            raise ValueError("Patient not found")
        return self.repository.find_by_patient(db, patient_id)

    def get_visits_for_doctor(self, db: Session, doctor_id: int):
        if not self.doctor_repository.find_by_id(db, doctor_id):
            raise ValueError("Doctor not found")
        return self.repository.find_by_doctor(db, doctor_id)

    def update_visit(self, db: Session, visit: VisitUpdate):
        updated = self.repository.update(db, visit.id, visit)
        if not updated:
            raise ValueError("Visit not found")
        return updated

    def delete_visit(self, db: Session, visit_id: int):
        deleted = self.repository.delete(db, visit_id)
        if not deleted:
            raise ValueError("Visit not found")