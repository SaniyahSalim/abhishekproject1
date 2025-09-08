from sqlalchemy.orm import Session
from app.db import models
from app.schemas.patient import PatientCreate


def create_patient(db: Session, patient: PatientCreate):
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def get_patient_id(db: Session, patient_id: int):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()


def get_all_patients(db: Session):
    return db.query(models.Patient).all()


def update_patient(db: Session, patient_id: int, patient: PatientCreate):
    db_patient = get_patient_id(db, patient_id)
    if not db_patient:
        return None
    for key, value in patient.model_dump().items():
        setattr(db_patient, key, value)
    db.commit()
    db.refresh(db_patient)
    return db_patient


def delete_patient(db: Session, patient_id: int):
    db_patient = get_patient_id(db, patient_id)
    if not db_patient:
        return False
    db.delete(db_patient)
    db.commit()
    return True
