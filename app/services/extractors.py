import os
import pdfplumber
import json
from dotenv import load_dotenv
import google.generativeai as genai
import re
# Load environment variables
load_dotenv()

# Configure Gemini with API key from .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY","AIzaSyAKIr5RVTKBO88pAsQNHp6zuaLnbKz0_m4"))

# REFERENCE_RANGES = {
#     "Hemoglobin": (12, 17),
#     "WBC Count": (4000, 11000),
#     "Platelet Count": (150000, 450000),
#     "Blood Sugar (Fasting)": (70, 120),
#     "Cholesterol (Total)": (150, 200),
#     "Triglycerides": (0, 150),  
#     "Serum Creatinine": (0.7, 1.3),
#     "SGPT (ALT)": (7, 55),
#     "SGOT (AST)": (8, 48),
#     "Bilirubin (Total)": (0.3, 1.2),
# }


def ai_extract_from_pdf(file_path: str):
    # Extract raw text from PDF
    with pdfplumber.open(file_path) as pdf:
        text = "\n".join([page.extract_text() or "" for page in pdf.pages])

    # Create prompt for Gemini
    prompt = f"""
    Extract lab results from the following medical report.
    Return **only valid JSON**, in this format:
    [
      {{
        "parameter": "Hemoglobin",
        "value": 16.6,
        "units": "g/dL",
        "normal_min": 13.0,
        "normal_max": 17.0,
        "status": "Normal"
      }}
    ]

    Report text:
    {text}
    """

    # Call Gemini
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    raw_text = response.text.strip()

    # Remove possible markdown fences like ```json ... ```
    cleaned_text = re.sub(r"^```[a-zA-Z]*\n", "", raw_text)
    cleaned_text = re.sub(r"\n```$", "", cleaned_text).strip()

    try:
        return json.loads(cleaned_text)  # Parse JSON safely
    except json.JSONDecodeError:
        print("⚠️ Gemini raw output:", raw_text)  # Debugging help
        raise ValueError("Failed to parse JSON from Gemini response")