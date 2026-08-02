from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas import DepartmentCreate, DepartmentResponse, DepartmentUpdate
from hartwell_backend.services import DepartmentService

router = APIRouter(prefix="/departments", tags=["Departments"])

service = DepartmentService()


@router.post("/", response_model=DepartmentResponse)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    try:
        return service.create_department(db, department)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return service.get_all_departments(db)


@router.get("/{department_id}", response_model=DepartmentResponse)
def get_department(department_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_department(db, department_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    


@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(department_id: int, department: DepartmentUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_department(db, department_id, department)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{department_id}", status_code=204)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_department(db, department_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
