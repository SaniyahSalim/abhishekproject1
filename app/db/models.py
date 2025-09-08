from sqlalchemy import Column,Integer,String,DateTime,ForeignKey,Float, text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
from sqlalchemy.sql import func


Base = declarative_base()


class User(Base):
    __tablename__ ="users"
    
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String, nullable=False)
    email = Column(String,unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    #one_user = many_patients
    patients = relationship("Patient", back_populates="user")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    email = Column(String, nullable=False)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="patients")
    reports  = relationship("Report", back_populates="patient")

class Report(Base):
    __tablename__ ="reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    uploaded_at = Column(DateTime(timezone=True), server_default="now()")
    file_path = Column(String, nullable=False)

    patient = relationship("Patient", back_populates="reports")
    results = relationship("ReportResult", back_populates="report")

class ReportResult(Base):
    __tablename__ = "report_results"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    parameter = Column(String, nullable=False)
    value = Column(String, nullable=False)
    normal_min = Column(Float)
    normal_max = Column(Float)
    status = Column(String)

    report = relationship("Report", back_populates="results")

