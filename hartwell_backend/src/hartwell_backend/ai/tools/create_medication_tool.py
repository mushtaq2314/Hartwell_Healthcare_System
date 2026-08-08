from langchain_core.tools import tool

from hartwell_backend.database import SessionLocal
from hartwell_backend.repositories import (
    PrescriptionRepository,
    MedicationRepository,
)


prescription_repository = PrescriptionRepository()
medication_repository = MedicationRepository()


def create_medication_tool():
    @tool
    def get_medications(visit_id: int):
        """
        Returns all prescribed medications for a visit.
        """
        print("get_medications tool called")
        db = SessionLocal()

        try:
            prescriptions = prescription_repository.find_by_visit(
                db,
                visit_id,
            )

            medications = []

            for prescription in prescriptions:
                medication = medication_repository.find_by_id(
                    db,
                    prescription.medication_id,
                )

                medications.append(
                    {
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

            return medications

        finally:
            db.close()

    return get_medications