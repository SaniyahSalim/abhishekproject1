from fastapi  import APIRouter, Depends,UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import models
from app.services.extractors import ai_extract_from_pdf
import shutil
import os


router = APIRouter(prefix="/reports", tags=["Reports"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/{patient_id}")
async def upload_report(patient_id:int, file: UploadFile, db:Session = Depends(get_db)):
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
        print("Filename: ",file.filename)
        if file.filename.endswith('.csv'):
            data = ai_extract_from_pdf(file_path)
            
        elif file.filename.endswith('.pdf'):
            data = ai_extract_from_pdf(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        report  = models.Report(patient_id=patient_id,file_path=file_path)
        db.add(report)
        db.commit() 
        db.refresh(report)
        
        print("Data extracted:", data)
        for entry in data:
            db.add(models.ReportResult(
                report_id = report.id,
                parameter = entry['parameter'],
                value = entry['value'],
                normal_min = entry["normal_min"],
                normal_max = entry["normal_max"],
                status = entry["status"]
                
                ))
            
        db.commit()
        return {"detail": "Report uploaded and processed successfully"}

@router.get("/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/patient/{patient_id}")
def get_reports_for_patient(patient_id: int, db: Session = Depends(get_db)):
    reports = db.query(models.Report).filter(models.Report.patient_id == patient_id).all()
    print("reports",reports)
    return reports

@router.get("/results/patient/{patient_id}")
def get_report_results_for_patient(patient_id: int, db: Session = Depends(get_db)):
    reports = db.query(models.Report).filter(models.Report.patient_id == patient_id).all()
    response = []
    for report in reports:
        results = db.query(models.ReportResult).filter(models.ReportResult.report_id == report.id).all()
        for r in results:
            response.append({
                "report_id": report.id,
                "parameter": r.parameter,
                "value": r.value,
                "normal_min": r.normal_min,
                "normal_max": r.normal_max,
                "status": r.status
            })
    return response

@router.get("/results/{report_id}")
def get_report_results(report_id: int, db: Session = Depends(get_db)):
    results = db.query(models.ReportResult).filter(models.ReportResult.report_id == report_id).all()
    if not results:
        raise HTTPException(status_code=404, detail="Results not found for the given report")
    return results

#historical reports for a patient
@router.get("/history/{patient_id}/results")
def get_historical_reports_results(patient_id:int, db:Session = Depends(get_db)):
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
                    "status": r.status
                } for r in results
            ]
        }
        history.append(report_data)
    return history