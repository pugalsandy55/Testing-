import io
import os
from typing import Dict, Any

class DocumentExporter:
    """
    Renders structured resume data to ATS-compliant PDF and Microsoft Word DOCX formats.
    """

    @classmethod
    def generate_docx(cls, resume_data: Dict[str, Any]) -> io.BytesIO:
        """Generate formatted DOCX resume."""
        import docx
        from docx.shared import Inches, Pt, RGBColor
        from docx.enum.text import WD_ALIGN_PARAGRAPH

        doc = docx.Document()

        # Set page margins (0.5 inch for ATS modern density)
        sections = doc.sections
        for section in sections:
            section.top_margin = Inches(0.6)
            section.bottom_margin = Inches(0.6)
            section.left_margin = Inches(0.6)
            section.right_margin = Inches(0.6)

        info = resume_data.get("personal_info", {})

        # Header: Name
        name_p = doc.add_paragraph()
        name_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        name_run = name_p.add_run(info.get("full_name", "Candidate Name"))
        name_run.font.name = "Arial"
        name_run.font.size = Pt(20)
        name_run.bold = True
        name_run.font.color.rgb = RGBColor(15, 23, 42)

        # Contact Coordinates
        contact_parts = []
        if info.get("email"): contact_parts.append(info["email"])
        if info.get("phone"): contact_parts.append(info["phone"])
        if info.get("location"): contact_parts.append(info["location"])
        if info.get("linkedin"): contact_parts.append(info["linkedin"])
        if info.get("github"): contact_parts.append(info["github"])

        if contact_parts:
            contact_p = doc.add_paragraph(" | ".join(contact_parts))
            contact_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in contact_p.runs:
                r.font.name = "Arial"
                r.font.size = Pt(9.5)
                r.font.color.rgb = RGBColor(71, 85, 105)

        # Professional Summary
        summary = resume_data.get("summary", "")
        if summary:
            cls._add_docx_section_heading(doc, "PROFESSIONAL SUMMARY")
            sp = doc.add_paragraph(summary)
            for r in sp.runs:
                r.font.name = "Arial"
                r.font.size = Pt(10)

        # Work Experience
        experiences = resume_data.get("experience", [])
        if experiences:
            cls._add_docx_section_heading(doc, "WORK EXPERIENCE")
            for exp in experiences:
                role_p = doc.add_paragraph()
                r1 = role_p.add_run(f"{exp.get('position', 'Role')} – {exp.get('company', 'Company')}")
                r1.bold = True
                r1.font.name = "Arial"
                r1.font.size = Pt(10.5)

                date_str = f" | {exp.get('start_date', '')} - {exp.get('end_date', 'Present')} | {exp.get('location', '')}"
                r2 = role_p.add_run(date_str)
                r2.italic = True
                r2.font.name = "Arial"
                r2.font.size = Pt(9.5)

                for hl in exp.get("highlights", []):
                    bp = doc.add_paragraph(hl, style='List Bullet')
                    for r in bp.runs:
                        r.font.name = "Arial"
                        r.font.size = Pt(9.5)

        # Technical Skills
        skills = resume_data.get("skills", [])
        if skills:
            cls._add_docx_section_heading(doc, "TECHNICAL & PROFESSIONAL SKILLS")
            sk_p = doc.add_paragraph(", ".join(skills))
            for r in sk_p.runs:
                r.font.name = "Arial"
                r.font.size = Pt(10)

        # Education
        education = resume_data.get("education", [])
        if education:
            cls._add_docx_section_heading(doc, "EDUCATION")
            for edu in education:
                ep = doc.add_paragraph()
                e1 = ep.add_run(f"{edu.get('degree', 'Degree')} in {edu.get('field_of_study', '')}")
                e1.bold = True
                e1.font.name = "Arial"
                e1.font.size = Pt(10)

                e2 = ep.add_run(f" – {edu.get('institution', '')} ({edu.get('start_date', '')} - {edu.get('end_date', '')})")
                e2.font.name = "Arial"
                e2.font.size = Pt(9.5)

        # Projects
        projects = resume_data.get("projects", [])
        if projects:
            cls._add_docx_section_heading(doc, "KEY PROJECTS")
            for proj in projects:
                pp = doc.add_paragraph()
                p1 = pp.add_run(f"{proj.get('title', 'Project')}")
                p1.bold = True
                p1.font.name = "Arial"
                p1.font.size = Pt(10)
                if proj.get("url"):
                    p2 = pp.add_run(f" ({proj['url']})")
                    p2.italic = True
                    p2.font.size = Pt(9)
                desc_p = doc.add_paragraph(proj.get("description", ""))
                for r in desc_p.runs:
                    r.font.name = "Arial"
                    r.font.size = Pt(9.5)

        output = io.BytesIO()
        doc.save(output)
        output.seek(0)
        return output

    @classmethod
    def generate_pdf(cls, resume_data: Dict[str, Any]) -> io.BytesIO:
        """Generate ATS-compliant single-pass PDF using ReportLab."""
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib import colors

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        primary_color = colors.HexColor(resume_data.get("design_settings", {}).get("primary_color", "#0e87ea"))
        text_color = colors.HexColor("#1e293b")

        name_style = ParagraphStyle(
            'NameStyle',
            fontName='Helvetica-Bold',
            fontSize=18,
            leading=22,
            alignment=1, # Center
            textColor=colors.HexColor("#0f172a")
        )
        contact_style = ParagraphStyle(
            'ContactStyle',
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            alignment=1,
            textColor=colors.HexColor("#475569")
        )
        section_style = ParagraphStyle(
            'SectionHeader',
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=primary_color,
            spaceBefore=8,
            spaceAfter=4
        )
        body_style = ParagraphStyle(
            'Body',
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=text_color
        )
        bullet_style = ParagraphStyle(
            'Bullet',
            fontName='Helvetica',
            fontSize=9,
            leading=12.5,
            textColor=text_color,
            leftIndent=12
        )

        elements = []
        info = resume_data.get("personal_info", {})

        # Name
        elements.append(Paragraph(info.get("full_name", "Candidate Name"), name_style))
        elements.append(Spacer(1, 4))

        # Contact line
        contact_parts = []
        if info.get("email"): contact_parts.append(info["email"])
        if info.get("phone"): contact_parts.append(info["phone"])
        if info.get("location"): contact_parts.append(info["location"])
        if info.get("linkedin"): contact_parts.append(info["linkedin"])
        if info.get("github"): contact_parts.append(info["github"])

        if contact_parts:
            elements.append(Paragraph(" &bull; ".join(contact_parts), contact_style))
            elements.append(Spacer(1, 8))

        # Summary
        summary = resume_data.get("summary", "")
        if summary:
            elements.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
            elements.append(HRFlowable(width="100%", thickness=0.8, color=primary_color, spaceAfter=4))
            elements.append(Paragraph(summary, body_style))
            elements.append(Spacer(1, 6))

        # Experience
        experiences = resume_data.get("experience", [])
        if experiences:
            elements.append(Paragraph("WORK EXPERIENCE", section_style))
            elements.append(HRFlowable(width="100%", thickness=0.8, color=primary_color, spaceAfter=4))
            for exp in experiences:
                role_head = f"<b>{exp.get('position', 'Role')}</b> &mdash; <i>{exp.get('company', 'Company')}</i>"
                date_loc = f"<font color='#64748b'>{exp.get('start_date', '')} - {exp.get('end_date', 'Present')} | {exp.get('location', '')}</font>"
                elements.append(Paragraph(f"{role_head} &nbsp;|&nbsp; {date_loc}", body_style))
                for hl in exp.get("highlights", []):
                    elements.append(Paragraph(f"&bull; {hl}", bullet_style))
                elements.append(Spacer(1, 4))

        # Skills
        skills = resume_data.get("skills", [])
        if skills:
            elements.append(Paragraph("TECHNICAL & PROFESSIONAL SKILLS", section_style))
            elements.append(HRFlowable(width="100%", thickness=0.8, color=primary_color, spaceAfter=4))
            elements.append(Paragraph(", ".join(skills), body_style))
            elements.append(Spacer(1, 6))

        # Education
        education = resume_data.get("education", [])
        if education:
            elements.append(Paragraph("EDUCATION", section_style))
            elements.append(HRFlowable(width="100%", thickness=0.8, color=primary_color, spaceAfter=4))
            for edu in education:
                edu_text = f"<b>{edu.get('degree', 'Degree')}</b>, {edu.get('field_of_study', '')} &mdash; <i>{edu.get('institution', '')}</i> ({edu.get('start_date', '')} - {edu.get('end_date', '')})"
                elements.append(Paragraph(edu_text, body_style))
            elements.append(Spacer(1, 6))

        # Projects
        projects = resume_data.get("projects", [])
        if projects:
            elements.append(Paragraph("KEY PROJECTS", section_style))
            elements.append(HRFlowable(width="100%", thickness=0.8, color=primary_color, spaceAfter=4))
            for proj in projects:
                p_text = f"<b>{proj.get('title', 'Project')}</b>: {proj.get('description', '')}"
                elements.append(Paragraph(p_text, body_style))
                elements.append(Spacer(1, 3))

        doc.build(elements)
        buffer.seek(0)
        return buffer

    @staticmethod
    def _add_docx_section_heading(doc, title: str):
        from docx.shared import Pt, RGBColor
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(title)
        run.bold = True
        run.font.name = "Arial"
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(14, 135, 234)
