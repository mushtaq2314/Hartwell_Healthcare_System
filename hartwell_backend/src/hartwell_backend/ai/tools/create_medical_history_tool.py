from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import (
    VisitRepository,
    AppointmentRepository,
)


visit_repository = VisitRepository()
appointment_repository = AppointmentRepository()


def create_medical_history_tool(current_patient_id: int):
    @tool
    def get_medical_history(patient_id: int):
        """
        Returns patient's appointments and visit history.
        """
        print("get_medical_history tool called")

        if patient_id != current_patient_id:
            return "Access denied."

        db = SessionLocal()

        try:
            visits = visit_repository.find_by_patient(
                db,
                patient_id,
            )

            appointments = appointment_repository.find_by_patient(
                db,
                patient_id,
            )

            return {
                "visits": [
                    {
                        "id": visit.id,
                        "doctor_id": visit.doctor_id,
                        "visit_date": str(visit.visit_date),
                        "chief_complaint": visit.chief_complaint,
                        "diagnosis": visit.diagnosis,
                        "notes": visit.clinical_notes,
                    }
                    for visit in visits
                ],
                "appointments": [
                    {
                        "id": appointment.id,
                        "doctor_id": appointment.doctor_id,
                        "appointment_date": str(
                            appointment.created_at
                        ),
                        "status": str(appointment.status),
                    }
                    for appointment in appointments
                ],
            }

        finally:
            db.close()

    return get_medical_history