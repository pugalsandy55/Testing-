import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "timestamp": "ok"}

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["templates_available"] == 1260

def test_auth_workflow():
    # Register test user
    test_email = f"tester_{pytest.__name__}@atsresume.ai"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": test_email,
        "password": "Password@123",
        "full_name": "Test User"
    })
    # Either 200 or 400 if already exists
    assert reg_res.status_code in [200, 400]

    # Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "Password@123"
    })
    if login_res.status_code == 200:
        token = login_res.json()["access_token"]
        assert token is not None

def test_template_marketplace():
    # Test catalog count and pagination
    res = client.get("/api/v1/templates?page=1&page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 1260
    assert len(data["templates"]) == 10

    # Test filtering by category
    cat_res = client.get("/api/v1/templates?category=software-engineer")
    assert cat_res.status_code == 200
    assert len(cat_res.json()["templates"]) > 0

    # Test color filter
    color_res = client.get("/api/v1/templates?color=Corporate Navy")
    assert color_res.status_code == 200
    assert len(color_res.json()["templates"]) > 0

def test_ats_scoring_engine():
    res = client.post("/api/v1/ats/check", json={
        "job_title": "Senior Software Engineer",
        "job_description": "We need experience with Python, FastAPI, React, Docker, and Redis.",
        "resume_content": {
            "personal_info": {
                "full_name": "Jordan Lee",
                "email": "jordan@example.com",
                "phone": "+1-555-0199",
                "location": "Seattle, WA"
            },
            "summary": "Experienced engineer with a track record in cloud architecture and backend APIs.",
            "skills": ["Python", "FastAPI", "React", "Docker", "PostgreSQL"],
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
    })
    assert res.status_code == 200
    data = res.json()
    assert data["overall_score"] >= 70
    assert "Python" in data["found_keywords"]
    assert "structure_score" in data
    assert "formatting_warnings" in data

def test_ai_optimization_endpoints():
    # Test bullet optimizer
    bullet_res = client.post("/api/v1/ai/optimize-bullet", json={
        "bullet_point": "Worked on backend services and handled bug fixes.",
        "target_role": "Backend Engineer"
    })
    assert bullet_res.status_code == 200
    assert bullet_res.json()["success"] is True
    assert "optimized" in bullet_res.json()["result"]

    # Test summary optimizer
    summary_res = client.post("/api/v1/ai/optimize-summary", json={
        "current_summary": "I am a web developer with 4 years experience.",
        "target_role": "Full Stack Developer",
        "skills": ["React", "Node", "TypeScript"]
    })
    assert summary_res.status_code == 200
    assert summary_res.json()["success"] is True

def test_document_export():
    # Create a resume
    create_res = client.post("/api/v1/resumes", json={
        "title": "Export Test Resume",
        "target_role": "Cloud Architect"
    })
    assert create_res.status_code == 200
    resume_id = create_res.json()["id"]

    # Export PDF
    pdf_res = client.get(f"/api/v1/export/pdf/{resume_id}")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000 # Valid binary PDF

    # Export DOCX
    docx_res = client.get(f"/api/v1/export/docx/{resume_id}")
    assert docx_res.status_code == 200
    assert "wordprocessingml" in docx_res.headers["content-type"]
    assert len(docx_res.content) > 1000 # Valid binary DOCX
