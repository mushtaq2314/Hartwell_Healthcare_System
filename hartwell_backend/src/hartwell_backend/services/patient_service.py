from sqlalchemy.orm import Session

from hartwell_backend.models import Patient
from hartwell_backend.repositories import PatientRepository
from hartwell_backend.schemas import PatientCreate, PatientUpdate


class PatientService:

    def __init__(self):
        self.repository = PatientRepository()

    def create_patient(self, db: Session, patient: PatientCreate) -> Patient:
        return self.repository.create(db, patient)

    def get_all_patients(self, db: Session) -> list[Patient]:
        return self.repository.find_all(db)

    def get_patient(self, db: Session, patient_id: int) -> Patient:
        patient = self.repository.find_by_id(db, patient_id)

        if not patient:
            raise ValueError("Patient not found")

        return patient
    
    def update_patient(self, db: Session, patient_id: int, patient: PatientUpdate) -> Patient:
        updated = self.repository.update(db, patient_id, patient)        
        if not updated:
            raise ValueError("Patient not found")
        return updated
    
    def delete_patient(self, db: Session, patient_id: int) -> bool:
        deleted = self.repository.delete(db, patient_id)
        if not deleted:
            raise ValueError("Patient not found")