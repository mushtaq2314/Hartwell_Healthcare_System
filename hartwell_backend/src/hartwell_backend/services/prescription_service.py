# services/prescription_service.py
from sqlalchemy.orm import Session

from hartwell_backend.repositories import MedicationRepository, PrescriptionRepository, TimelineEventRepository, VisitRepository
from hartwell_backend.schemas import PrescriptionCreate, PrescriptionUpdate, TimelineEventCreate


class PrescriptionService:

    def __init__(self):
        self.repository = PrescriptionRepository()
        self.visit_repository = VisitRepository()
        self.medication_repository = MedicationRepository()
        self.timeline_repository = TimelineEventRepository()

    def create_prescription(self, db: Session, prescription: PrescriptionCreate):
        visit = self.visit_repository.find_by_id(db, prescription.visit_id)
        if not visit:
            raise ValueError("Visit not found")
        if not self.medication_repository.find_by_id(db, prescription.medication_id):
            raise ValueError("Medication not found")

        db_prescription = self.repository.create(db, prescription)

        self.timeline_repository.create(
            db,
            TimelineEventCreate(
                patient_id=visit.patient_id,
                visit_id=visit.id,
                event_type="PRESCRIPTION_ADDED",
                title="Prescription Added",
                description=f"{prescription.dosage} - {prescription.frequency}",
            ),
        )

        return db_prescription

    def get_all_prescriptions(self, db: Session):
        return self.repository.find_all(db)

    def get_prescription(self, db: Session, prescription_id: int):
        prescription = self.repository.find_by_id(db, prescription_id)
        if not prescription:
            raise ValueError("Prescription not found")
        return prescription

    def get_prescriptions_for_visit(self, db: Session, visit_id: int):
        if not self.visit_repository.find_by_id(db, visit_id):
            raise ValueError("Visit not found")
        return self.repository.find_by_visit(db, visit_id)

    def update_prescription(self, db: Session, prescription: PrescriptionUpdate):
        updated = self.repository.update(db, prescription.id, prescription)
        if not updated:
            raise ValueError("Prescription not found")
        return updated

    def delete_prescription(self, db: Session, prescription_id: int):
        deleted = self.repository.delete(db, prescription_id)
        if not deleted:
            raise ValueError("Prescription not found")