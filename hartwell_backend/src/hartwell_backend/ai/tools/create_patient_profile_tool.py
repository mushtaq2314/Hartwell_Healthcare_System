from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import PatientRepository


patient_repository = PatientRepository()


def create_patient_profile_tool(current_patient_id: int):
    @tool
    def get_patient_profile(patient_id: int):
        """
        Returns the complete patient profile.
        """
        print("get_patient_profile tool called")

        if patient_id != current_patient_id:
            return "Access denied."

        db = SessionLocal()

        try:
            patient = patient_repository.find_by_id(db, patient_id)

            if patient is None:
                return {"error": "Patient not found"}

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