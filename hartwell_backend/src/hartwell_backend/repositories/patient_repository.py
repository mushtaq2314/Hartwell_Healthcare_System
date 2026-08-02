from sqlalchemy.orm import Session

from hartwell_backend.models import Patient
from hartwell_backend.schemas import PatientCreate


class PatientRepository:

    def create(self, db: Session, patient: PatientCreate) -> Patient:
        db_patient = Patient(
            name=patient.name,
            email=patient.email,
            phone=patient.phone,
        )

        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)

        return db_patient

    def find_all(self, db: Session):
        return db.query(Patient).all()

    def find_by_id(self, db: Session, patient_id: int):
        return db.query(Patient).filter(Patient.id == patient_id).first()