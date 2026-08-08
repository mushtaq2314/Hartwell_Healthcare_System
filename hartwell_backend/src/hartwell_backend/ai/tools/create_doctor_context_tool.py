from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import (
    PatientRepository,
    VisitRepository,
    ReportRepository,
    TimelineEventRepository,
    PrescriptionRepository,
    MedicationRepository,
)


patient_repository = PatientRepository()
visit_repository = VisitRepository()
report_repository = ReportRepository()
timeline_repository = TimelineEventRepository()
prescription_repository = PrescriptionRepository()
medication_repository = MedicationRepository()


def create_doctor_context_tool(current_patient_id: int):
    @tool
    def get_doctor_context(patient_id: int):
        """
        Returns the complete patient context for doctor review.
        """
        print("get_doctor_context tool called")

        if patient_id != current_patient_id:
            return "Access denied."

        db = SessionLocal()

        try:
            patient = patient_repository.find_by_id(
                db,
                patient_id,
            )

            if patient is None:
                return {"error": "Patient not found"}

            visits = visit_repository.find_by_patient(
                db,
                patient_id,
            )

            reports = report_repository.find_by_patient(
                db,
                patient_id,
            )

            timeline = timeline_repository.find_by_patient(
                db,
                patient_id,
            )

            prescriptions = []

            for visit in visits:
                visit_prescriptions = prescription_repository.find_by_visit(
                    db,
                    visit.id,
                )

                for prescription in visit_prescriptions:
                    medication = medication_repository.find_by_id(
                        db,
                        prescription.medication_id,
                    )

                    prescriptions.append(
                        {
                            "visit_id": visit.id,
                            "medication": medication.name,
                            "generic_name": medication.generic_name,
                            "dosage": prescription.dosage,
                            "frequency": prescription.frequency,
                            "duration": prescription.duration,
                            "instructions": prescription.instructions,
                        }
                    )

            return {
                "patient": {
                    "id": patient.id,
                    "first_name": patient.first_name,
                    "last_name": patient.last_name,
                    "gender": patient.gender,
                    "dob": str(patient.dob),
                    "blood_group": patient.blood_group,
                    "phone": patient.phone,
                    "email": patient.email,
                },
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
                "reports": [
                    {
                        "id": report.id,
                        "title": report.title,
                        "type": report.report_type,
                        "summary": report.ai_summary,
                        "status": report.processing_status,
                        "uploaded_at": str(report.uploaded_at),
                    }
                    for report in reports
                ],
                "prescriptions": prescriptions,
                "timeline": [
                    {
                        "event": event.event_type,
                        "title": event.title,
                        "description": event.description,
                        "timestamp": str(event.event_time),
                    }
                    for event in timeline
                ],
            }

        finally:
            db.close()

    return get_doctor_context