from sqlalchemy.orm import Session

from hartwell_backend.models import Patient
from hartwell_backend.schemas import PatientCreate, PatientUpdate
from hartwell_backend.core.security import hash_password

class PatientRepository:

    def create(self, db: Session, patient: PatientCreate) -> Patient:
        db_patient = Patient(**patient.model_dump(exclude={"password"}))
        db_patient.password_hash = hash_password(patient.password)
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)

        return db_patient

    def find_all(self, db: Session) -> list[Patient]:
        return db.query(Patient).all()

    def find_by_id(self, db: Session, patient_id: int) -> Patient:
        return db.query(Patient).filter(Patient.id == patient_id).first()
        
    def find_by_email(self, db: Session, email: int) -> Patient:
        return db.query(Patient).filter(Patient.email == email).first()
    
    def update(self, db: Session, patient_id: int, patient: PatientUpdate) -> Patient | None:
        existing = self.find_by_id(db, patient_id)
        if not existing:
            raise ValueError("Patient record not found")
        for key, value in patient.model_dump(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    
    def delete(self, db: Session, patient_id: int) -> bool:
        db_patient = self.find_by_id(db, patient_id)
        if not db_patient:
            return False
        db.delete(db_patient)
        db.commit()
        return True