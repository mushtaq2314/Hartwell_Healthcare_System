from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import (
    DoctorRepository,
    PatientRepository,
    VisitRepository,
    ReportRepository,
    PrescriptionRepository,
    MedicationRepository,
    TimelineEventRepository,
)


doctor_repository = DoctorRepository()
patient_repository = PatientRepository()
visit_repository = VisitRepository()
report_repository = ReportRepository()
prescription_repository = PrescriptionRepository()
medication_repository = MedicationRepository()
timeline_repository = TimelineEventRepository()


def _doctor_can_access_patient(db, doctor_id: int, patient_id: int) -> bool:
    doctor = doctor_repository.find_by_id(db, doctor_id)

    if doctor is None:
        return False

    visits = visit_repository.find_by_doctor(db, doctor_id)

    for visit in visits:
        if visit.patient_id == patient_id:
            return True

    return False


def create_doctor_context_tool(doctor_id: int):
    @tool
    def get_doctor_context():
        """
        Returns the profile of the currently authenticated doctor.
        """
        db = SessionLocal()

        try:
            doctor = doctor_repository.find_by_id(db, doctor_id)

            if doctor is None:
                return {"error": "Doctor not found."}

            return {
                "id": doctor.id,
                "first_name": doctor.first_name,
                "last_name": doctor.last_name,
            }
        finally:
            db.close()

    return get_doctor_context


def create_patient_profile_tool(doctor_id: int):
    @tool
    def get_patient_profile(patient_id: int):
        """
        Returns the profile of a patient if the doctor is
        authorized to access that patient.
        """
        db = SessionLocal()

        try:
            if not _doctor_can_access_patient(db, doctor_id, patient_id):
                return {"error": "Access denied."}

            patient = patient_repository.find_by_id(db, patient_id)

            if patient is None:
                return {"error": "Patient not found."}

            return {
                "id": patient.id,
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "gender": patient.gender,
                "dob": str(patient.dob),
                "phone": patient.phone,
                "email": patient.email,
                "blood_group": patient.blood_group,
                "address": patient.address,
            }
        finally:
            db.close()

    return get_patient_profile


def create_medical_history_tool(doctor_id: int):
    @tool
    def get_medical_history(patient_id: int):
        """
        Returns the patient's visit history if the doctor
        is authorized to access the patient.
        """
        db = SessionLocal()

        try:
            if not _doctor_can_access_patient(db, doctor_id, patient_id):
                return {"error": "Access denied."}

            visits = visit_repository.find_by_patient(db, patient_id)

            return [
                {
                    "id": visit.id,
                    "patient_id": visit.patient_id,
                    "doctor_id": visit.doctor_id,
                    "visit_date": str(visit.visit_date),
                    "chief_complaint": getattr(visit, "chief_complaint", None),
                    "diagnosis": getattr(visit, "diagnosis", None),
                    "notes": getattr(visit, "clinical_notes", None),
                }
                for visit in visits
            ]
        finally:
            db.close()

    return get_medical_history


def create_report_tool(doctor_id: int):
    @tool
    def get_patient_reports(patient_id: int):
        """
        Returns all reports belonging to a patient if the
        doctor is authorized to access the patient.
        """
        db = SessionLocal()

        try:
            if not _doctor_can_access_patient(db, doctor_id, patient_id):
                return {"error": "Access denied."}

            reports = report_repository.find_by_patient(db, patient_id)

            return [
                {
                    "id": report.id,
                    "patient_id": report.patient_id,
                    "visit_id": report.visit_id,
                    "title": report.title,
                    "report_type": report.report_type,
                    "file_name": report.file_name,
                    "extracted_text": report.extracted_text,
                    "ai_summary": report.ai_summary,
                    "processing_status": report.processing_status,
                    "uploaded_at": str(report.uploaded_at),
                }
                for report in reports
            ]
        finally:
            db.close()

    return get_patient_reports


def create_medication_tool(doctor_id: int):
    @tool
    def get_patient_medications(patient_id: int):
        """
        Returns medications prescribed to a patient if the
        doctor is authorized to access the patient.
        """
        db = SessionLocal()

        try:
            if not _doctor_can_access_patient(db, doctor_id, patient_id):
                return {"error": "Access denied."}

            visits = visit_repository.find_by_patient(db, patient_id)
            result = []

            for visit in visits:
                prescriptions = prescription_repository.find_by_visit(db, visit.id)

                for prescription in prescriptions:
                    medication = medication_repository.find_by_id(db, prescription.medication_id)

                    if medication is None:
                        continue

                    result.append(
                        {
                            "visit_id": visit.id,
                            "prescription_id": prescription.id,
                            "medication_id": medication.id,
                            "name": medication.name,
                            "generic_name": medication.generic_name,
                            "dosage": prescription.dosage,
                            "frequency": prescription.frequency,
                            "duration": prescription.duration,
                            "instructions": prescription.instructions,
                        }
                    )

            return result
        finally:
            db.close()

    return get_patient_medications


def create_timeline_tool(doctor_id: int):
    @tool
    def get_patient_timeline(patient_id: int):
        """
        Returns the timeline events for a patient if the
        doctor is authorized to access the patient.
        """
        db = SessionLocal()

        try:
            if not _doctor_can_access_patient(db, doctor_id, patient_id):
                return {"error": "Access denied."}

            events = timeline_repository.find_by_patient(db, patient_id)

            return [
                {
                    "id": event.id,
                    "patient_id": event.patient_id,
                    "visit_id": event.visit_id,
                    "event_type": event.event_type,
                    "title": event.title,
                    "description": event.description,
                    "created_at": str(event.event_time),
                }
                for event in events
            ]
        finally:
            db.close()

    return get_patient_timeline


def create_comparison_tool(doctor_id: int):
    @tool
    def compare_reports(patient_id: int, report_id_1: int, report_id_2: int):
        """
        Compares two reports belonging to an authorized patient.
        """
        db = SessionLocal()

        try:
            if not _doctor_can_access_patient(db, doctor_id, patient_id):
                return {"error": "Access denied."}

            report1 = report_repository.find_by_id(db, report_id_1)
            report2 = report_repository.find_by_id(db, report_id_2)

            if report1 is None or report2 is None:
                return {"error": "One or more reports not found."}

            if report1.patient_id != patient_id or report2.patient_id != patient_id:
                return {"error": "Access denied."}

            return {
                "report_1": {
                    "id": report1.id,
                    "title": report1.title,
                    "report_type": report1.report_type,
                    "summary": report1.ai_summary,
                    "text": report1.extracted_text,
                },
                "report_2": {
                    "id": report2.id,
                    "title": report2.title,
                    "report_type": report2.report_type,
                    "summary": report2.ai_summary,
                    "text": report2.extracted_text,
                },
            }
        finally:
            db.close()

    return compare_reports