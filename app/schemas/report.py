from pydantic import BaseModel
from datetime import datetime
from typing import List

class ReportResultBase(BaseModel):

    parameter: str
    value: float
    normal_min:float
    normal_max:float
    status:str


class ReportResultCreate(ReportResultBase):
    pass

class ReportBase(BaseModel):
    patient_id:int
    uploaded_at: datetime
    file_name:str
    results: List[ReportResultCreate] =[]

