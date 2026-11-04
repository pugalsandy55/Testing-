import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.services.ats_analyzer import ATSScoringEngine
from ai_engine.provider import AIProvider
from template_engine.generator import TemplateEngineGenerator
from document_processing.parser import DocumentParser
from document_processing.exporter import DocumentExporter

def run_tests():
    print("--> 1. Testing Template Engine...")
    templates = TemplateEngineGenerator.generate_all_templates()
    assert len(templates) == 1260
    print(f"    [PASS] Generated {len(templates)} templates across 21 categories.")

    print("--> 2. Testing ATS Compatibility Analyzer...")
    sample_content = {
        "personal_info": {
            "full_name": "Jordan Lee",
            "email": "jordan@example.com",
            "phone": "+1-555-0199",
            "location": "Seattle, WA",
            "headline": "Senior Cloud Engineer"
        },
        "summary": "Experienced engineer with a track record in cloud architecture and backend APIs.",
        "skills": ["Python", "FastAPI", "React", "Docker", "PostgreSQL", "AWS"],
        "experience": [
            {
                "id": "e1",
                "company": "Tech Corp",
                "position": "Software Engineer",
                "start_date": "2020",
                "end_date": "Present",
                "highlights": [
                    "Architected scalable microservices reducing server latency by 40%."
                ]
            }
        ],
        "education": [
            {
                "id": "ed1",
                "institution": "University of Washington",
                "degree": "B.S. Computer Science",
                "start_date": "2016",
                "end_date": "2020"
            }
        ]
    }
    result = ATSScoringEngine.analyze(
        resume_content=sample_content,
        job_title="Senior Cloud Engineer",
        job_description="Seeking engineer with Python, FastAPI, React, Docker, and AWS."
    )
    assert result["overall_score"] >= 70
    assert "Python" in result["found_keywords"]
    print(f"    [PASS] ATS Score: {result['overall_score']}%, Keyword Match: {result['keyword_match_pct']}%.")

    print("--> 3. Testing AI Provider & Rewriting...")
    bullet_res = AIProvider.optimize_bullet("Worked on backend services and handled bug fixes.")
    assert "optimized" in bullet_res
    assert "action_verb_used" in bullet_res
    
    summary_res = AIProvider.optimize_summary(
        current_summary="I build web apps.",
        target_role="Full Stack Engineer",
        skills=["React", "Python"]
    )
    assert len(summary_res) > 30

    skills_res = AIProvider.recommend_skills(
        current_skills=["Python"],
        target_role="Software Engineer"
    )
    assert len(skills_res) > 0

    cover_res = AIProvider.generate_cover_letter(
        job_title="Full Stack Engineer",
        company_name="Acme Corp",
        candidate_name="Jordan Lee",
        experience_summary="Architected cloud services",
        skills=["React", "Python"]
    )
    assert "Acme Corp" in cover_res
    print("    [PASS] AI summary, bullet rewrite, skills recommendation, and cover letter passed.")

    print("--> 4. Testing Document Exporter (PDF & DOCX)...")
    pdf_buffer = DocumentExporter.generate_pdf(sample_content)
    pdf_bytes = pdf_buffer.getvalue()
    assert len(pdf_bytes) > 1000

    docx_buffer = DocumentExporter.generate_docx(sample_content)
    docx_bytes = docx_buffer.getvalue()
    assert len(docx_bytes) > 1000
    print(f"    [PASS] PDF ({len(pdf_bytes)} bytes) and DOCX ({len(docx_bytes)} bytes) generated successfully.")

    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
