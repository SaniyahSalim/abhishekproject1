import os
import pdfplumber
import json
from dotenv import load_dotenv
import google.generativeai as genai
import re
# Load environment variables
load_dotenv()
print("Current working directory:", os.getcwd())
# Configure Gemini with API key from .env
print("Gemini API Key:", os.getenv("GEMINI_API_KEY",) is not None)  # Debugging help
genai.configure(api_key=os.getenv("GEMINI_API_KEY",))

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

    Important normalization rules:
    - Always standardize and unify parameter names across different wording variations.
      Use commonly accepted medical/lab terminology as the canonical name.
    - Do not create duplicate entries if the report uses synonyms or slightly different names.
      Examples:
        * "25-OH VITAMIN D (TOTAL)" / "Vitamin D (25 - OH VITAMIN D)" → "Vitamin D (25-OH, Total)"
        * "Hb" / "HGB" → "Hemoglobin"
        * "LDL" / "LDL Chol" / "Low Density Lipoprotein Cholesterol" → "LDL Cholesterol"
        * "HDL" / "High Density Lipoprotein" → "HDL Cholesterol"
        * "TC" / "Total Chol" → "Total Cholesterol"
        * "TG" / "Triglyceride" → "Triglycerides"
    - If multiple values for the same canonical parameter appear in the text, keep only one consolidated entry.
    - Use your medical knowledge to categorize parameters even if they are written differently across reports.

    Constraints:
    - Only output valid JSON.
    - No free text, explanations, or additional fields outside the specified JSON format.

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