from marshmallow import Schema, fields

class MedicalReportCreateRequestSchema(Schema):
    """Schema for creating a Medical Report. Bác sĩ nhập ghi chú, chỉ số -> backend tự tạo PDF."""
    patient_id = fields.Int(required=True, metadata={'description': "Patient ID"})
    analysis_id = fields.Int(required=True, metadata={'description': "Analysis ID"})
    doctor_id = fields.Int(required=True, metadata={'description': "Doctor ID"})
    report_url = fields.Str(load_default=None, metadata={'description': "Optional: URL nếu đã có file; bỏ trống để backend tự tạo PDF"})
    notes = fields.Str(load_default='', metadata={'description': "Ghi chú bác sĩ"})
    clinical_summary = fields.Str(load_default='', metadata={'description': "Chỉ số / tóm tắt lâm sàng"})

class MedicalReportUpdateRequestSchema(Schema):
    """Schema for updating a Medical Report"""
    report_url = fields.Str(metadata={'description': "URL to the report document"})

class MedicalReportResponseSchema(Schema):
    """Schema for Medical Report response"""
    report_id = fields.Int(required=True, metadata={'description': "Unique report identifier"})
    patient_id = fields.Int(required=True, metadata={'description': "Patient ID"})
    analysis_id = fields.Int(required=True, metadata={'description': "Analysis ID"})
    doctor_id = fields.Int(required=True, metadata={'description': "Doctor ID"})
    report_url = fields.Str(required=True, metadata={'description': "URL to the report document"})
    notes = fields.Str(allow_none=True, metadata={'description': "Ghi chú bác sĩ"})
    clinical_summary = fields.Str(allow_none=True, metadata={'description': "Chỉ số / tóm tắt lâm sàng"})
    created_at = fields.DateTime(required=True, metadata={'description': "Report creation timestamp"})

