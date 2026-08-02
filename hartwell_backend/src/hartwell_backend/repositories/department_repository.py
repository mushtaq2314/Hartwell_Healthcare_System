from sqlalchemy.orm import Session

from hartwell_backend.models import Department
from hartwell_backend.schemas.department import DepartmentCreate, DepartmentUpdate


class DepartmentRepository:

    def create(self, db: Session, department: DepartmentCreate) -> Department:
        department_data = department.model_dump()
        db_department = Department(**department_data)
        db.add(db_department)
        db.commit()
        db.refresh(db_department)

        return db_department

    def find_all(self, db: Session) -> list[Department]:
        return db.query(Department).all()

    def find_by_id(self, db: Session, department_id: int) -> Department:
        return db.query(Department).filter(Department.id == department_id).first()

    def update(self, db: Session, department_id: int, department: DepartmentUpdate) -> Department | None:
        existing = self.find_by_id(db, department_id)
        if not existing:
            raise ValueError("Department not found")
        for key, value in department.model_dump(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing

    def delete(self, db: Session, department_id: int) -> bool:
        db_department = self.find_by_id(db, department_id)
        if not db_department:
            return False
        db.delete(db_department)
        db.commit()
        return True
