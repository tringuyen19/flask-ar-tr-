


-- ==================== 16. CONVERSATIONS (12: 1 per patient với bác sĩ xoay 1..7) ====================
BEGIN
    ;WITH pat AS (SELECT patient_id, ROW_NUMBER() OVER (ORDER BY patient_id) AS rn FROM patient_profiles),
         doc AS (SELECT doctor_id, ROW_NUMBER() OVER (ORDER BY doctor_id) AS rn FROM doctor_profiles)
    INSERT INTO conversations (patient_id, doctor_id, created_at, status)
    SELECT p.patient_id, (SELECT TOP 1 doctor_id FROM doc WHERE doc.rn = ((p.rn - 1) % 7) + 1), DATEADD(day, -(20 - p.rn), GETDATE()), 'active'
    FROM pat p
    WHERE NOT EXISTS (SELECT 1 FROM conversations c WHERE c.patient_id = p.patient_id);
END
GO

-- ==================== 17. MESSAGES (2 per conversation = 24: patient hỏi + doctor trả lời) ====================
BEGIN
    INSERT INTO messages (conversation_id, sender_type, sender_name, content, message_type, sent_at)
    SELECT c.conversation_id, 'patient', pp.patient_name, 'Xin bác sĩ tư vấn kết quả phân tích ảnh.', 'text', DATEADD(day, -2, GETDATE())
    FROM conversations c INNER JOIN patient_profiles pp ON pp.patient_id = c.patient_id
    WHERE NOT EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.conversation_id AND m.sender_type = 'patient');
END
BEGIN
    INSERT INTO messages (conversation_id, sender_type, sender_name, content, message_type, sent_at)
    SELECT c.conversation_id, 'doctor', dp.doctor_name, 'Đã xem. Bệnh nhân nên tái khám theo lịch. Đã gửi báo cáo.', 'text', DATEADD(day, -1, GETDATE())
    FROM conversations c INNER JOIN doctor_profiles dp ON dp.doctor_id = c.doctor_id
    WHERE NOT EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.conversation_id AND m.sender_type = 'doctor');
END
GO

-- ==================== 18. NOTIFICATIONS (12 patient ai_result_ready + 7 doctor new_review_request) ====================
BEGIN
    INSERT INTO notifications (account_id, type, content, is_read, created_at)
    SELECT ac.account_id, 'ai_result_ready', 'Kết quả phân tích ảnh võng mạc đã sẵn sàng.', CASE WHEN pp.patient_id % 2 = 1 THEN 1 ELSE 0 END, DATEADD(day, -2, GETDATE())
    FROM accounts ac INNER JOIN patient_profiles pp ON pp.account_id = ac.account_id
    WHERE ac.role_id = 3 AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.account_id = ac.account_id AND n.type = 'ai_result_ready');
END
BEGIN
    INSERT INTO notifications (account_id, type, content, is_read, created_at)
    SELECT ac.account_id, 'new_review_request', 'Có phân tích mới cần bác sĩ duyệt.', 0, DATEADD(day, -1, GETDATE())
    FROM accounts ac INNER JOIN doctor_profiles dp ON dp.account_id = ac.account_id
    WHERE ac.role_id = 2 AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.account_id = ac.account_id AND n.type = 'new_review_request');
END
GO

-- ==================== 19. NOTIFICATION_TEMPLATES ====================
BEGIN
    IF NOT EXISTS (SELECT 1 FROM notification_templates WHERE template_name = 'ai_result_ready')
        INSERT INTO notification_templates (template_name, template_type, subject, content_template, variables_schema, is_active, created_at, updated_at)
        VALUES ('ai_result_ready', 'email', 'Kết quả phân tích AURA', 'Xin chào {{patient_name}}, kết quả phân tích ảnh võng mạc của bạn đã sẵn sàng.', '{"patient_name": "string"}', 1, GETDATE(), GETDATE());
END
BEGIN
    IF NOT EXISTS (SELECT 1 FROM notification_templates WHERE template_name = 'subscription_expired')
        INSERT INTO notification_templates (template_name, template_type, subject, content_template, variables_schema, is_active, created_at, updated_at)
        VALUES ('subscription_expired', 'email', 'Gói dịch vụ AURA hết hạn', 'Gói dịch vụ của bạn đã hết hạn vào {{end_date}}. Vui lòng gia hạn.', '{"end_date": "string"}', 1, GETDATE(), GETDATE());
END
BEGIN
    IF NOT EXISTS (SELECT 1 FROM notification_templates WHERE template_name = 'report_ready')
        INSERT INTO notification_templates (template_name, template_type, subject, content_template, variables_schema, is_active, created_at, updated_at)
        VALUES ('report_ready', 'email', 'Báo cáo y tế đã sẵn sàng', 'Báo cáo y tế cho bệnh nhân {{patient_name}} đã được tạo.', '{"patient_name": "string", "report_url": "string"}', 1, GETDATE(), GETDATE());
END
GO

-- ==================== 20. AUDIT_LOGS (admin + 7 doctors login + 12 report/create + system) ====================
BEGIN
    DECLARE @aud_acc BIGINT = (SELECT account_id FROM accounts WHERE email = 'admin@aura.com');
    IF @aud_acc IS NOT NULL AND NOT EXISTS (SELECT 1 FROM audit_logs WHERE account_id = @aud_acc AND action_type = 'login')
        INSERT INTO audit_logs (account_id, action_type, entity_type, entity_id, description, ip_address, created_at)
        VALUES (@aud_acc, 'login', 'account', @aud_acc, 'Admin logged in', '127.0.0.1', GETDATE());
END
BEGIN
    INSERT INTO audit_logs (account_id, action_type, entity_type, entity_id, description, ip_address, created_at)
    SELECT ac.account_id, 'login', 'account', ac.account_id, 'Doctor logged in', '127.0.0.1', DATEADD(day, -1, GETDATE())
    FROM accounts ac WHERE ac.role_id = 2
    AND NOT EXISTS (SELECT 1 FROM audit_logs al WHERE al.account_id = ac.account_id AND al.action_type = 'login');
END
BEGIN
    INSERT INTO audit_logs (account_id, action_type, entity_type, entity_id, description, ip_address, created_at)
    SELECT dp.account_id, 'create', 'medical_report', mr.report_id, 'Doctor created medical report', '127.0.0.1', mr.created_at
    FROM medical_reports mr
    INNER JOIN doctor_profiles dp ON dp.doctor_id = mr.doctor_id
    WHERE NOT EXISTS (SELECT 1 FROM audit_logs al WHERE al.entity_type = 'medical_report' AND al.entity_id = mr.report_id);
END
BEGIN
    IF NOT EXISTS (SELECT 1 FROM audit_logs WHERE account_id IS NULL AND action_type = 'system')
        INSERT INTO audit_logs (account_id, action_type, entity_type, entity_id, description, created_at)
        VALUES (NULL, 'system', 'system', NULL, 'Daily backup completed', DATEADD(day, -1, GETDATE()));
END
GO

PRINT 'Seed data completed. 3 clinics, 7 doctors, 12 patients. service_packages: 6 (3 patient + 3 clinic). clinic_patient_allocations (clinic cấp lượt upload cho patient). Entities: roles, clinics, accounts, doctor_profiles, patient_profiles, ai_model_versions, service_packages (package_type), subscriptions, clinic_patient_allocations, payments, retinal_images (12), ai_analysis (12), ai_results (12), ai_annotations (12), doctor_reviews (12), medical_reports (12), conversations (12), messages (24), notifications (19), notification_templates, audit_logs.';
GO
