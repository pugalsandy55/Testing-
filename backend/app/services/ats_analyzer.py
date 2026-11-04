import re
from typing import Dict, Any, List

class ATSScoringEngine:
    """
    Transparent ATS Compatibility Scoring Engine.
    Evaluates:
    1. Structure & Essential Sections (25 pts)
    2. Contact Information Completeness (15 pts)
    3. Keyword & Skills Relevance / Job Match (30 pts)
    4. Action Verbs & Quantified Results (20 pts)
    5. Formatting & Layout Safety (10 pts)
    """

    ACTION_VERBS = {
        "architected", "engineered", "spearheaded", "orchestrated", "developed",
        "streamlined", "automated", "optimized", "accelerated", "designed",
        "implemented", "executed", "generated", "maximized", "pioneered",
        "led", "reduced", "delivered", "transformed", "scaled", "boosted"
    }

    REQUIRED_SECTIONS = ["summary", "experience", "education", "skills"]

    @classmethod
    def analyze(cls, resume_content: Dict[str, Any], job_title: str = "", job_description: str = "") -> Dict[str, Any]:
        structure_score = cls._score_structure(resume_content)
        contact_score, contact_warnings = cls._score_contact(resume_content.get("personal_info", {}))
        quant_score, verb_recommendations = cls._score_quantification_and_verbs(resume_content.get("experience", []))
        
        keyword_pct, found_kw, missing_kw, skill_score = cls._score_keywords(
            resume_content, job_title, job_description
        )
        formatting_score, format_warnings = cls._score_formatting(resume_content)

        # Total calculated score out of 100
        # Structure (25) + Contact (15) + Skills/Keywords (30) + Verbs/Metrics (20) + Format (10)
        total_score = min(100, int(
            structure_score +
            contact_score +
            (skill_score * 0.30) +
            quant_score +
            formatting_score
        ))

        recommendations = []
        if structure_score < 25:
            recommendations.append({
                "title": "Complete Missing Standard Sections",
                "description": "Ensure your resume has standard sections: Professional Summary, Work Experience, Education, and Skills.",
                "impact": "high"
            })
        if contact_score < 15:
            recommendations.append({
                "title": "Provide Full Contact Coordinates",
                "description": "Add your email, phone number, location, and LinkedIn profile link for recruiter outreach.",
                "impact": "high"
            })
        if missing_kw:
            recommendations.append({
                "title": f"Incorporate Key Technical Terms ({len(missing_kw)} identified)",
                "description": f"Target keywords like {', '.join(missing_kw[:5])} are valued for this role.",
                "impact": "high"
            })
        if quant_score < 15:
            recommendations.append({
                "title": "Quantify Career Achievements with Metrics",
                "description": "Use percentage gains, revenue impacts, dollar figures, or team scale (e.g., 'reduced latency by 35%').",
                "impact": "medium"
            })
        for rec in verb_recommendations:
            recommendations.append(rec)

        all_warnings = contact_warnings + format_warnings

        summary_evaluation = cls._generate_summary_evaluation(total_score, keyword_pct)

        return {
            "overall_score": total_score,
            "keyword_match_pct": keyword_pct,
            "structure_score": int((structure_score / 25) * 100),
            "skills_score": int(skill_score),
            "formatting_score": int((formatting_score / 10) * 100),
            "impact_score": int((quant_score / 20) * 100),
            "found_keywords": found_kw,
            "missing_keywords": missing_kw,
            "formatting_warnings": all_warnings,
            "recommendations": recommendations,
            "summary_evaluation": summary_evaluation
        }

    @classmethod
    def _score_structure(cls, content: Dict[str, Any]) -> int:
        score = 0
        if content.get("summary") and len(content["summary"]) > 40:
            score += 5
        if content.get("experience") and len(content["experience"]) > 0:
            score += 10
        if content.get("education") and len(content["education"]) > 0:
            score += 5
        if content.get("skills") and len(content["skills"]) >= 3:
            score += 5
        return score

    @classmethod
    def _score_contact(cls, contact: Dict[str, Any]) -> (int, List[Dict[str, str]]):
        score = 0
        warnings = []
        if contact.get("full_name") and len(contact["full_name"]) >= 2:
            score += 4
        else:
            warnings.append({
                "category": "Contact Details",
                "severity": "error",
                "message": "Candidate name missing or unparseable.",
                "fix_suggestion": "Specify your first and last name prominently at the top."
            })

        if contact.get("email") and "@" in contact["email"]:
            score += 4
        else:
            warnings.append({
                "category": "Contact Details",
                "severity": "error",
                "message": "Valid email address not detected.",
                "fix_suggestion": "Include a professional email address (e.g. name@domain.com)."
            })

        if contact.get("phone"):
            score += 4
        else:
            warnings.append({
                "category": "Contact Details",
                "severity": "warning",
                "message": "Phone number not detected.",
                "fix_suggestion": "Include an active contact phone number."
            })

        if contact.get("linkedin") or contact.get("github") or contact.get("location"):
            score += 3

        return score, warnings

    @classmethod
    def _score_quantification_and_verbs(cls, experiences: List[Dict[str, Any]]) -> (int, List[Dict[str, str]]):
        score = 0
        metric_regex = re.compile(r'(\d+[\d,.]*|\$|\%|\+|\b[0-9]+x\b)', re.IGNORECASE)
        recs = []

        bullets = []
        for exp in experiences:
            bullets.extend(exp.get("highlights", []))

        if not bullets:
            return 5, recs

        # 1. Action verbs score (up to 10 pts)
        verb_count = 0
        metric_count = 0

        for bullet in bullets:
            first_word = bullet.strip().split()[0].lower() if bullet.strip() else ""
            cleaned_word = re.sub(r'[^a-z]', '', first_word)
            if cleaned_word in cls.ACTION_VERBS:
                verb_count += 1
            if metric_regex.search(bullet):
                metric_count += 1

        if verb_count >= len(bullets) * 0.5:
            score += 10
        elif verb_count > 0:
            score += 6
        else:
            score += 2
            recs.append({
                "title": "Begin Bullet Points with Dynamic Action Verbs",
                "description": "Start bullet points with verbs such as Orchestrated, Spearheaded, Accelerated, or Engineered.",
                "impact": "medium"
            })

        # 2. Metric score (up to 10 pts)
        if metric_count >= len(bullets) * 0.4:
            score += 10
        elif metric_count > 0:
            score += 6
        else:
            score += 2

        return score, recs

    @classmethod
    def _score_keywords(cls, content: Dict[str, Any], job_title: str, job_description: str) -> (int, List[str], List[str], int):
        resume_skills = set(s.lower() for s in content.get("skills", []))
        
        # Aggregate all resume text
        all_text = " ".join([
            content.get("summary", ""),
            " ".join([h for exp in content.get("experience", []) for h in exp.get("highlights", [])]),
            " ".join([p.get("description", "") for p in content.get("projects", [])])
        ]).lower()

        if job_description and len(job_description.strip()) > 30:
            target_keywords = cls._extract_keywords_from_jd(job_description)
        else:
            # Fallback default technical and operational keywords
            target_keywords = [
                "python", "react", "sql", "api", "docker", "git", "cloud",
                "agile", "architecture", "testing", "ci/cd", "security"
            ]

        found = []
        missing = []

        for kw in target_keywords:
            if kw in resume_skills or re.search(r'\b' + re.escape(kw) + r'\b', all_text):
                found.append(kw.title())
            else:
                missing.append(kw.title())

        match_pct = int((len(found) / max(1, len(target_keywords))) * 100)
        skills_score = min(100, max(20, match_pct))

        return match_pct, found, missing, skills_score

    @staticmethod
    def _extract_keywords_from_jd(jd: str) -> List[str]:
        words = re.findall(r'[a-zA-Z0-9#+.]+', jd.lower())
        stopwords = {"and", "or", "the", "in", "with", "for", "to", "a", "an", "is", "of", "as", "by", "that", "this", "our", "you", "will", "we", "are"}
        freq = {}
        for w in words:
            if len(w) > 2 and w not in stopwords:
                freq[w] = freq.get(w, 0) + 1
        sorted_kws = sorted(freq.items(), key=lambda x: x[1], reverse=True)
        return [kw for kw, _ in sorted_kws[:15]]

    @classmethod
    def _score_formatting(cls, content: Dict[str, Any]) -> (int, List[Dict[str, str]]):
        score = 10
        warnings = []
        
        # Check text lengths
        summary = content.get("summary", "")
        if len(summary) > 600:
            score -= 2
            warnings.append({
                "category": "Formatting",
                "severity": "info",
                "message": "Professional summary exceeds 600 characters.",
                "fix_suggestion": "Trim summary to 3-4 impactful sentences for recruiter readability."
            })

        for exp in content.get("experience", []):
            if len(exp.get("highlights", [])) > 7:
                score -= 1
                warnings.append({
                    "category": "Formatting",
                    "severity": "info",
                    "message": f"Position at {exp.get('company')} has over 7 bullets.",
                    "fix_suggestion": "Consolidate into 4-5 high-impact bullet points."
                })
                break

        return max(5, score), warnings

    @staticmethod
    def _generate_summary_evaluation(score: int, keyword_pct: int) -> str:
        if score >= 85:
            return "Excellent ATS Compatibility! Your resume demonstrates strong structure, keyword alignment, and measurable accomplishments."
        elif score >= 70:
            return "Good ATS Compatibility with minor optimization opportunities. Focus on adding more quantified metrics and closing identified keyword gaps."
        elif score >= 50:
            return "Moderate ATS Compatibility. Address formatting warnings, complete standard sections, and enhance bullet points with action verbs."
        else:
            return "Significant ATS improvements needed. Restructure contact details, flesh out experience bullets, and incorporate role-specific keywords."
