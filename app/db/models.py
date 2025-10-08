from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # One user can have many patients
    patients = relationship(
        "Patient",
        back_populates="owner",
        foreign_keys="Patient.owner_id"  # explicitly specify the foreign key
    )


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    email = Column(String, nullable=False)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # only one owner
    owner = relationship(
        "User",
        back_populates="patients",
        foreign_keys=[owner_id]  # explicit
    )

    reports = relationship("Report", back_populates="patient")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default="now()")
    file_path = Column(String, nullable=False)

    patient = relationship("Patient", back_populates="reports")
    results = relationship("ReportResult", back_populates="report")


class ReportResult(Base):
    __tablename__ = "report_results"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    parameter = Column(String, nullable=False)
    value = Column(String, nullable=False)
    normal_min = Column(Float)
    normal_max = Column(Float)
    status = Column(String)

    report = relationship("Report", back_populates="results")
