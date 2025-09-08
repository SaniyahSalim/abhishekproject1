from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api import patients,reports,auth
from app.db import models
from app.db.session import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart HealtCare Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)
app.include_router(patients.router)
app.include_router(reports.router)
app.include_router(auth.router)

@app.get("/")

def root():
    return {"message": "Welcome to Smart HealthCare Analyzer API"}

# from sqlalchemy import create_engine
# engine = create_engine("'postgresql://neondb_owner:npg_eGirbljKf4Q9@ep-quiet-shape-adh9ys3v-pooler.c-2.us-east-1.aws.neon.tech/Smart_HealthCare_Analyzer?sslmode=require&channel_binding=require'")
# with engine.connect() as conn:
#     print(conn.execute("SELECT 1").fetchall())