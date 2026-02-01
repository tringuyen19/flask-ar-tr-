"""
Tạo file PDF báo cáo y tế từ thông tin bác sĩ nhập + kết quả AI.
Dùng ReportLab, lưu vào thư mục uploads/reports.
Tránh đường dẫn có ký tự Unicode (Windows) gây lỗi (0, b'Unknown error').
"""
import os
import sys
import uuid
from datetime import datetime
from typing import Optional, Dict, Any

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors


def _safe_uploads_dir():
    """Thư mục lưu PDF: ưu tiên thư mục chỉ chứa ASCII để tránh lỗi trên Windows (unicode path)."""
    base = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads', 'reports')
    try:
        base_ascii = base.encode('ascii').decode('ascii')
    except (UnicodeEncodeError, UnicodeDecodeError):
        # Đường dẫn có ký tự đặc biệt (VD: công nghệ phần mềm) -> dùng thư mục tạm
        base = os.path.join(os.environ.get('TEMP', os.path.expanduser('~')), 'aura_report_pdfs')
    return os.path.abspath(base)


UPLOADS_DIR = _safe_uploads_dir()


def _ensure_uploads_dir():
    os.makedirs(UPLOADS_DIR, exist_ok=True)


def generate_medical_report_pdf(
    patient_id: int,
    analysis_id: int,
    doctor_id: int,
    notes: str = '',
    clinical_summary: str = '',
    ai_result: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Tạo file PDF báo cáo, lưu vào uploads/reports. Trả về đường dẫn file (để lưu report_url).
    ai_result: dict với disease_type, risk_level, confidence_score (từ ai_results).
    """
    _ensure_uploads_dir()
    filename = f"report_{uuid.uuid4().hex[:12]}.pdf"
    filepath = os.path.join(UPLOADS_DIR, filename)
    # Đảm bảo path chỉ dùng ký tự an toàn (tránh lỗi ReportLab/OS trên Windows)
    filepath = os.path.normpath(os.path.abspath(filepath))

    doc = SimpleDocTemplate(filepath, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=16, spaceAfter=12)
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=12, spaceAfter=6)
    body_style = styles['Normal']

    story = []
    story.append(Paragraph("BÁO CÁO Y TẾ - AURA", title_style))
    story.append(Paragraph(f"Ngày tạo: {datetime.now().strftime('%d/%m/%Y %H:%M')}", body_style))
    story.append(Spacer(1, 0.5*cm))

    story.append(Paragraph("Thông tin chung", heading_style))
    data = [
        ["Patient ID", str(patient_id)],
        ["Analysis ID", str(analysis_id)],
        ["Doctor ID", str(doctor_id)],
    ]
    t = Table(data, colWidths=[4*cm, 10*cm])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.lightgrey), ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)]))
    story.append(t)
    story.append(Spacer(1, 0.5*cm))

    if ai_result:
        story.append(Paragraph("Kết quả phân tích AI", heading_style))
        ai_data = [
            ["Loại bệnh", str(ai_result.get('disease_type', '-'))],
            ["Mức độ rủi ro", str(ai_result.get('risk_level', '-'))],
            ["Độ tin cậy", str(ai_result.get('confidence_score', '-'))],
        ]
        t2 = Table(ai_data, colWidths=[4*cm, 10*cm])
        t2.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.lightblue), ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)]))
        story.append(t2)
        story.append(Spacer(1, 0.5*cm))

    if clinical_summary:
        story.append(Paragraph("Chỉ số / Tóm tắt lâm sàng", heading_style))
        story.append(Paragraph(clinical_summary.replace('\n', '<br/>'), body_style))
        story.append(Spacer(1, 0.5*cm))

    if notes:
        story.append(Paragraph("Ghi chú bác sĩ", heading_style))
        story.append(Paragraph(notes.replace('\n', '<br/>'), body_style))

    doc.build(story)
    return filepath


def get_report_url_from_filepath(filepath: str) -> str:
    """
    Chuyển filepath thành URL để lưu DB.
    Trả về /api/medical-reports/files/report_xxx.pdf để frontend ghép với API_BASE để xem/tải.
    """
    filename = os.path.basename(filepath)
    return f"/api/medical-reports/files/{filename}"
