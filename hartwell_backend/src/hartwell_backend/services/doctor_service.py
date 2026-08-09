from sqlalchemy.orm import Session
from pydantic import EmailStr

from hartwell_backend.models import Doctor
from hartwell_backend.repositories import DoctorRepository
from hartwell_backend.schemas import DoctorCreate, DoctorUpdate


class DoctorService:

    def __init__(self):
        self.repository = DoctorRepository()

    def create_doctor(self, db: Session, doctor: DoctorCreate) -> Doctor:
        return self.repository.create(db, doctor)

    def get_all_doctors(self, db: Session) -> list[Doctor]:
        return self.repository.find_all(db)

    def get_doctor(self, db: Session, doctor_id: int) -> Doctor:
        doctor = self.repository.find_by_id(db, doctor_id)
        if not doctor:
            raise ValueError("Doctor not found")
        return doctor
    
    def get_doctor_by_email(self, db: Session, email: EmailStr) -> Doctor:
        doctor = self.repository.find_by_email(db, email)
        if not doctor:
            raise ValueError("Doctor not found")
        return doctor

    def update_doctor(self, db: Session, doctor_id: int, doctor: DoctorUpdate) -> Doctor:
        updated = self.repository.update(db, doctor_id, doctor)
        if not updated:
            raise ValueError("Doctor not found")
        return updated

    def delete_doctor(self, db: Session, doctor_id: int) -> None:
        deleted = self.repository.delete(db, doctor_id)
        if not deleted:
            raise ValueError("Doctor not found")
