# repositories/visit_repository.py
from sqlalchemy.orm import Session

from hartwell_backend.models import Visit
from hartwell_backend.schemas import VisitCreate, VisitUpdate


class VisitRepository:

    def create(self, db: Session, visit: VisitCreate) -> Visit:
        db_visit = Visit(**visit.model_dump())
        db.add(db_visit)
        db.commit()
        db.refresh(db_visit)
        return db_visit

    def find_all(self, db: Session):
        return db.query(Visit).all()

    def find_by_id(self, db: Session, visit_id: int):
        return db.query(Visit).filter(Visit.id == visit_id).first()

    def find_by_patient(self, db: Session, patient_id: int):
        return db.query(Visit).filter(Visit.patient_id == patient_id).order_by(Visit.visit_date.desc()).all()

    def find_by_doctor(self, db: Session, doctor_id: int):
        return db.query(Visit).filter(Visit.doctor_id == doctor_id).order_by(Visit.visit_date.desc()).all()

    def update(self, db: Session, visit_id: int, visit: VisitUpdate) -> Visit | None:
        visit_data = visit.model_dump(exclude_unset=True, exclude={"id"})
        db_visit = self.find_by_id(db, visit_id)
        if not db_visit:
            return None
        for field, value in visit_data.items():
            setattr(db_visit, field, value)
        db.commit()
        db.refresh(db_visit)
        return db_visit

    def delete(self, db: Session, visit_id: int) -> bool:
        db_visit = self.find_by_id(db, visit_id)
        if not db_visit:
            return False
        db.delete(db_visit)
        db.commit()
        return True