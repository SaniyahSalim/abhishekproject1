from fastapi import APIRouter, Depends, UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.services.extractors import ai_extract_from_pdf
from app.db.models import User
from app.core.security import get_current_user
import shutil
import os


router = APIRouter(prefix="/reports", tags=["Reports"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ------------------------
# Upload report
# ------------------------
@router.post("/upload/{patient_id}")
async def upload_report(
    patient_id: int,
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = (
        db.query(models.Patient)
        .filter(models.Patient.id == patient_id, models.Patient.owner_id == current_user.id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or access denied")

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        print("Filename:", file.filename)
        if file.filename.endswith(".csv"):
            data = ai_extract_from_pdf(file_path)
        elif file.filename.endswith(".pdf"):
            data = ai_extract_from_pdf(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        report = models.Report(patient_id=patient_id, file_path=file_path)
        db.add(report)
        db.commit()
        db.refresh(report)

        print("Data extracted:", data)
        for entry in data:
            db.add(
                models.ReportResult(
                    report_id=report.id,
                    parameter=entry["parameter"],
                    value=entry["value"],
                    normal_min=entry["normal_min"],
                    normal_max=entry["normal_max"],
                    status=entry["status"],
                )
            )

        db.commit()
        return {"detail": "Report uploaded and processed successfully"}


# ------------------------
# Get a single report
# ------------------------
@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = (
        db.query(models.Report)
        .join(models.Patient)
        .filter(models.Report.id == report_id, models.Patient.owner_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found or access denied")
    return report


# ------------------------
# Get all reports for a patient
# ------------------------
@router.get("/patient/{patient_id}")
def get_reports_for_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = (
        db.query(models.Patient)
        .filter(models.Patient.id == patient_id, models.Patient.owner_id == current_user.id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=403, detail="Not authorized to view this patient's reports")

    reports = db.query(models.Report).filter(models.Report.patient_id == patient_id).all()
    return reports


# ------------------------
# Get results for all reports of a patient
# ------------------------
@router.get("/results/patient/{patient_id}")
def get_report_results_for_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    patient = (
        db.query(models.Patient)
        .filter(models.Patient.id == patient_id, models.Patient.owner_id == current_user.id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=403, detail="Not authorized to view results for this patient")

    reports = db.query(models.Report).filter(models.Report.patient_id == patient_id).all()
    response = []
    for report in reports:
        results = db.query(models.ReportResult).filter(models.ReportResult.report_id == report.id).all()
        for r in results:
            response.append(
                {
                    "report_id": report.id,
                    "parameter": r.parameter,
                    "value": r.value,
                    "normal_min": r.normal_min,
                    "normal_max": r.normal_max,
                    "status": r.status,
                }
            )
    return response


# ------------------------
# Get results for a single report
# ------------------------
@router.get("/results/{report_id}")
def get_report_results(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    report = (
        db.query(models.Report)
        .join(models.Patient)
        .filter(models.Report.id == report_id, models.Patient.owner_id == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=403, detail="Not authorized to view this report's results")

    results = db.query(models.ReportResult).filter(models.ReportResult.report_id == report_id).all()
    if not results:
        raise HTTPException(status_code=404, detail="Results not found for the given report")
    return results


# ------------------------
# Historical reports for a patient
# ------------------------
@router.get("/history/{patient_id}/results")
def get_historical_reports_results(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    patient = (
        db.query(models.Patient)
        .filter(models.Patient.id == patient_id, models.Patient.owner_id == current_user.id)
        .first()
    )
    if not patient:
        raise HTTPException(status_code=403, detail="Not authorized to view this patient's history")

    reports = db.query(models.Report).filter(models.Report.patient_id == patient_id).all()
    history = []
    for report in reports:
        results = db.query(models.ReportResult).filter(models.ReportResult.report_id == report.id).all()
        report_data = {
            "report_id": report.id,
            "uploaded_at": report.uploaded_at,
            "results": [
                {
                    "parameter": r.parameter,
                    "value": r.value,
                    "normal_min": r.normal_min,
                    "normal_max": r.normal_max,
                    "status": r.status,
                }
                for r in results
            ],
        }
        history.append(report_data)
    return history
