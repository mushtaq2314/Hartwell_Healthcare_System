# repositories/prescription_repository.py
from sqlalchemy.orm import Session

from hartwell_backend.models import Prescription
from hartwell_backend.schemas import PrescriptionCreate, PrescriptionUpdate


class PrescriptionRepository:

    def create(self, db: Session, prescription: PrescriptionCreate) -> Prescription:
        db_prescription = Prescription(**prescription.model_dump())
        db.add(db_prescription)
        db.commit()
        db.refresh(db_prescription)
        return db_prescription

    def find_all(self, db: Session):
        return db.query(Prescription).all()

    def find_by_id(self, db: Session, prescription_id: int):
        return db.query(Prescription).filter(Prescription.id == prescription_id).first()

    def find_by_visit(self, db: Session, visit_id: int):
        return db.query(Prescription).filter(Prescription.visit_id == visit_id).all()

    def update(self, db: Session, prescription_id: int, prescription: PrescriptionUpdate)-> Prescription | None:
        prescription_data = prescription.model_dump(exclude_unset=True, exclude={"id"})
        db_prescription = self.find_by_id(db, prescription_id)
        if not db_prescription:
            return None
        for field, value in prescription_data.items():
            setattr(db_prescription, field, value)
        db.commit()
        db.refresh(db_prescription)
        return db_prescription

    def delete(self, db: Session, prescription_id: int) -> bool:
        db_prescription = self.find_by_id(db, prescription_id)
        if not db_prescription:
            return False
        db.delete(db_prescription)
        db.commit()
        return True