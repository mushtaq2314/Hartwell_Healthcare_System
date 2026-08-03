from sqlalchemy.orm import Session

from hartwell_backend.models import Doctor
from hartwell_backend.schemas.doctor import DoctorCreate, DoctorUpdate


class DoctorRepository:

    def create(self, db: Session, doctor: DoctorCreate) -> Doctor:
        db_doctor = Doctor(**doctor.model_dump())
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)

        return db_doctor

    def find_all(self, db: Session) -> list[Doctor]:
        return db.query(Doctor).all()

    def find_by_id(self, db: Session, doctor_id: int) -> Doctor:
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()

    def update(self, db: Session, doctor_id: int, doctor: DoctorUpdate) -> Doctor | None:
        existing = self.find_by_id(db, doctor_id)
        if not existing:
            raise ValueError("Doctor record not found")
        for key, value in doctor.model_dump(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing

    def delete(self, db: Session, doctor_id: int) -> bool:
        db_doctor = self.find_by_id(db, doctor_id)
        if not db_doctor:
            return False
        db.delete(db_doctor)
        db.commit()
        return True
