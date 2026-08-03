from sqlalchemy.orm import Session

from hartwell_backend.models import Medication
from hartwell_backend.schemas import MedicationCreate, MedicationUpdate


class MedicationRepository:

    def create(self, db: Session, medication: MedicationCreate) -> Medication:
        db_medication = Medication(**medication.model_dump())
        db.add(db_medication)
        db.commit()
        db.refresh(db_medication)
        return db_medication

    def find_all(self, db: Session):
        return db.query(Medication).all()

    def find_by_id(self, db: Session, medication_id: int):
        return db.query(Medication).filter(Medication.id == medication_id).first()

    def find_by_generic_name(self, db: Session, generic_name: str):
        return db.query(Medication).filter(Medication.generic_name == generic_name).first()

    def search(self, db: Session, query: str):
        pattern = f"%{query}%"
        return db.query(Medication).filter(
            (Medication.generic_name.ilike(pattern)) | (Medication.brand_name.ilike(pattern))
        ).all()

    def update(self, db: Session, medication_id: int, medication: MedicationUpdate) -> Medication | None:
        medication_data = medication.model_dump(exclude_unset=True, exclude={"id"})
        db_medication = self.find_by_id(db, medication_id)
        if not db_medication:
            return None
        for field, value in medication_data.items():
            setattr(db_medication, field, value)
        db.commit()
        db.refresh(db_medication)
        return db_medication

    def delete(self, db: Session, medication_id: int) -> bool:
        db_medication = self.find_by_id(db, medication_id)
        if not db_medication:
            return False
        db.delete(db_medication)
        db.commit()
        return True