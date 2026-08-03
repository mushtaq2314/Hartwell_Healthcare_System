from sqlalchemy.orm import Session

from hartwell_backend.repositories import MedicationRepository
from hartwell_backend.schemas import MedicationCreate, MedicationUpdate


class MedicationService:

    def __init__(self):
        self.repository = MedicationRepository()

    def create_medication(self, db: Session, medication: MedicationCreate):
        existing = self.repository.find_by_generic_name(db, medication.generic_name)
        if existing:
            raise ValueError("Medication with this generic name already exists")

        return self.repository.create(db, medication)

    def get_all_medications(self, db: Session):
        return self.repository.find_all(db)

    def get_medication(self, db: Session, medication_id: int):
        medication = self.repository.find_by_id(db, medication_id)
        if not medication:
            raise ValueError("Medication not found")
        return medication

    def search_medications(self, db: Session, query: str):
        return self.repository.search(db, query)

    def update_medication(self, db: Session, medication: MedicationUpdate):
        updated = self.repository.update(db, medication.id, medication)
        if not updated:
            raise ValueError("Medication not found")
        return updated

    def delete_medication(self, db: Session, medication_id: int):
        deleted = self.repository.delete(db, medication_id)
        if not deleted:
            raise ValueError("Medication not found")