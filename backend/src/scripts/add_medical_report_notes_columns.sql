-- Thêm cột notes, clinical_summary vào medical_reports (bác sĩ nhập -> tạo PDF -> lưu DB)
-- Chạy khi nâng cấp từ bản cũ không có 2 cột này

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.medical_reports') AND name = 'notes')
BEGIN
    ALTER TABLE dbo.medical_reports ADD notes NVARCHAR(MAX) NULL;
END
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.medical_reports') AND name = 'clinical_summary')
BEGIN
    ALTER TABLE dbo.medical_reports ADD clinical_summary NVARCHAR(MAX) NULL;
END
