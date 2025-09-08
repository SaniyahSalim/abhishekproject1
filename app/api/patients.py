from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import crud
from app.schemas.patient import PatientCreate, Patient
from app.db.session import get_db

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.post("/", response_model=Patient)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    return crud.create_patient(db=db, patient=patient)


@router.get("/{patient_id}", response_model=Patient)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient_id(db, patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@router.get("/", response_model=list[Patient])
def read_all_patients(db: Session = Depends(get_db)):
    return crud.get_all_patients(db=db)


@router.put("/{patient_id}", response_model=Patient)
def update_patient(patient_id: int, patient: PatientCreate, db: Session = Depends(get_db)):
    db_patient = crud.update_patient(db=db, patient_id=patient_id, patient=patient)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@router.delete("/{patient_id}", response_model=dict)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    success = crud.delete_patient(db=db, patient_id=patient_id)
    if not success:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted successfully"}
