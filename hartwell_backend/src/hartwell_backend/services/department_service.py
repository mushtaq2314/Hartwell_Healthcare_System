from sqlalchemy.orm import Session

from hartwell_backend.models import Department
from hartwell_backend.repositories import DepartmentRepository
from hartwell_backend.schemas import DepartmentCreate, DepartmentUpdate


class DepartmentService:

    def __init__(self):
        self.repository = DepartmentRepository()

    def create_department(self, db: Session, department: DepartmentCreate) -> Department:
        return self.repository.create(db, department)

    def get_all_departments(self, db: Session) -> list[Department]:
        return self.repository.find_all(db)

    def get_department(self, db: Session, department_id: int) -> Department:
        department = self.repository.find_by_id(db, department_id)
        if not department:
            raise ValueError("Department not found")
        return department

    def update_department(self, db: Session, department_id: int, department: DepartmentUpdate) -> Department:
        updated = self.repository.update(db, department_id, department)
        if not updated:
            raise ValueError("Department not found")
        return updated

    def delete_department(self, db: Session, department_id: int) -> None:
        deleted = self.repository.delete(db, department_id)
        if not deleted:
            raise ValueError("Department not found")
