import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ProjectName: str = "Smart HealthCare Analyzer"
    # print("database url", os.getenv("DATABASE_URL",'postgresql://neondb_owner:npg_eGirbljKf4Q9@ep-quiet-shape-adh9ys3v-pooler.c-2.us-east-1.aws.neon.tech/Smart_HealthCare_Analyzer?sslmode=require&channel_binding=require'))
    DATABASE_URL: str = os.getenv("DATABASE_URL","postgresql://neondb_owner:npg_eGirbljKf4Q9@ep-quiet-shape-adh9ys3v-pooler.c-2.us-east-1.aws.neon.tech/Smart_HealthCare_Analyzer?sslmode=require&channel_binding=require")

settings = Settings()