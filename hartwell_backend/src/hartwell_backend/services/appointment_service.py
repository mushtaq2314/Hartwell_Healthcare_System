from datetime import datetime, timezone
from sqlalchemy.orm import Session

from hartwell_backend.models import Appointment, AppointmentStatus
from hartwell_backend.repositories import AppointmentRepository, PatientRepository, DoctorRepository
from hartwell_backend.schemas import AppointmentCreate, AppointmentUpdate

class AppointmentService:
    def __init__(self):
        self.repository = AppointmentRepository()
        self.patient_repository = PatientRepository()
        self.doctor_repository = DoctorRepository()
        
    def create_appointment(self, db: Session, appointment: AppointmentCreate) -> Appointment:
        if appointment.appointment_time < datetime.now(tz=timezone.utc):
            raise ValueError("Appointment time must be in the future.")
        
        if appointment.patient_id is not None and not self.patient_repository.find_by_id(db, appointment.patient_id):
            raise ValueError("Patient not found!")
        if appointment.doctor_id is not None and not self.doctor_repository.find_by_id(db, appointment.doctor_id):
            raise ValueError("Doctor not found!")
        
        if not self.__is_doctor_available(db, appointment.appointment_time, appointment.doctor_id):
            raise ValueError("Doctor unavailable, please try with some other appointment time!")
        if not self.__is_patient_available(db, appointment.appointment_time, appointment.patient_id):
            raise ValueError("Looks like you have another appointment at the same time, please try with some other appointment time!")
        
        return self.repository.create(db, appointment)
    
    def get_all_appointments(self, db: Session) -> list[Appointment]:
        return self.repository.find_all(db)
    
    def get_appointment(self, db: Session, appointment_id: int) -> Appointment:
        appointment = self.repository.find_by_id(db, appointment_id)
        if not appointment:
            raise ValueError("Appointment not found")
        return appointment
    
    def get_appointments_for_patient(self, db: Session, patient_id: int) -> list[Appointment]:
        if not self.patient_repository.find_by_id(db, patient_id):
            raise ValueError("Patient not found")
        return self.repository.find_by_patient(db, patient_id)

    def get_appointments_for_doctor(self, db: Session, doctor_id: int) -> list[Appointment]:
        if not self.doctor_repository.find_by_id(db, doctor_id):
            raise ValueError("Doctor not found")
        return self.repository.find_by_doctor(db, doctor_id)
    
    def update_appointment(self, db: Session, appointment: AppointmentUpdate) -> Appointment:
        if appointment.patient_id is not None and not self.patient_repository.find_by_id(db, appointment.patient_id):
            raise ValueError("Patient not found")
        if appointment.doctor_id is not None and not self.doctor_repository.find_by_id(db, appointment.doctor_id):
            raise ValueError("Doctor not found")

        updated = self.repository.update(db, appointment.id, appointment)
        if not updated:
            raise ValueError("Appointment not found")
        return updated

    def cancel_appointment(self, db: Session, appointment_id: int) -> Appointment:
        appointment = self.repository.find_by_id(db, appointment_id)
        if not appointment:
            raise ValueError("Appointment not found")

        if appointment.status == AppointmentStatus.COMPLETED:
            raise ValueError("Cannot cancel an appointment that is already completed")

        return self.repository.set_status(db, appointment_id, AppointmentStatus.CANCELLED)
    
    def __is_doctor_available(self, db: Session, appointment_time: datetime, doctor_id: int) -> bool:
        """Checks if doctor is busy (has any other appointments) at the requested appointment time."""
        
        doctor_appointments = self.get_appointments_for_doctor(db, doctor_id)
        for appointment in doctor_appointments:
            if appointment_time == appointment.appointment_time and appointment.status != "Cancelled":
                return False
        
        return True
    
    def __is_patient_available(self, db: Session, appointment_time: datetime, patient_id: int) -> bool:
        """Checks if patient has any other pending appointments at the same time"""
        patient_appointments = self.get_appointments_for_patient(db, patient_id)
        for appointment in patient_appointments:
            if appointment_time == appointment.appointment_time and appointment.status != "Cancelled":
                return False
        
        return True