from sqlalchemy.orm import Session

from hartwell_backend.models import Appointment, AppointmentStatus
from hartwell_backend.schemas import AppointmentCreate, AppointmentUpdate

class AppointmentRepository:
    
    def create(self, db: Session, appointment: AppointmentCreate) -> Appointment:
        appointment_data = appointment.model_dump()
        db_appointment = Appointment(**appointment_data)
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        
        return db_appointment
    
    def find_all(self, db: Session) -> list[Appointment]:
        return db.query(Appointment).all()
    
    def find_by_id(self, db: Session, appointment_id: int) -> Appointment:
        return db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    def find_by_patient(self, db: Session, patient_id: int):
        return db.query(Appointment).filter(Appointment.patient_id == patient_id).all()

    def find_by_doctor(self, db: Session, doctor_id: int):
        return db.query(Appointment).filter(Appointment.doctor_id == doctor_id).all()
    
    def update(self, db: Session, appointment_id: int, appointment: AppointmentUpdate) -> Appointment:
        existing = self.find_by_id(db, appointment_id)
        
        if not existing:
            raise ValueError("Appointment not found")
        appointment_data = appointment.model_dump(exclude_unset=True)
        for key, value in appointment_data.items():
            setattr(existing, key, value)
        
        db.commit()
        db.refresh(existing)
        return existing
    
    def set_status(self, db: Session, appointment_id: int, status: AppointmentStatus) -> Appointment:
        return self.update(db, appointment_id, AppointmentUpdate(id=appointment_id, status=status))