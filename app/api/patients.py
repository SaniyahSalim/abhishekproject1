from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import crud
from app.schemas.patient import PatientCreate, Patient
from app.db.session import get_db
from app.db.models import User
from app.core.security import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/", response_model=Patient)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_patient(db=db, patient=patient, user_id=current_user.id)


@router.get("/", response_model=list[Patient])
def read_all_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_all_patients(db=db, user_id=current_user.id)


@router.get("/{patient_id}", response_model=Patient)
def read_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_patient = crud.get_patient_id(db, patient_id, current_user.id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@router.put("/{patient_id}", response_model=Patient)
def update_patient(
    patient_id: int,
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_patient = crud.update_patient(db=db, patient_id=patient_id, patient=patient, user_id=current_user.id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@router.delete("/{patient_id}", response_model=dict)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = crud.delete_patient(db=db, patient_id=patient_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted successfully"}
