from sqlalchemy.orm import Session

from hartwell_backend.repositories import PatientRepository
from hartwell_backend.schemas import PatientCreate


class PatientService:

    def __init__(self):
        self.repository = PatientRepository()

    def create_patient(self, db: Session, patient: PatientCreate):
        existing = db.query(self.repository.find_all(db)[0].__class__)\
                     .filter_by(email=patient.email).first() \
                     if self.repository.find_all(db) else None

        if existing:
            raise ValueError("Patient with this email already exists")

        return self.repository.create(db, patient)

    def get_all_patients(self, db: Session):
        return self.repository.find_all(db)

    def get_patient(self, db: Session, patient_id: int):
        patient = self.repository.find_by_id(db, patient_id)

        if not patient:
            raise ValueError("Patient not found")

        return patient