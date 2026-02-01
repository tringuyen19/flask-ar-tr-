create database RetinalHealthDB;
use RetinalHealthDB;

USE master;
GO

ALTER DATABASE RetinalHealthDB
SET SINGLE_USER
WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE RetinalHealthDB;
GO

INSERT INTO roles (role_name)
VALUES
('Admin'),
('Doctor'),
('Patient'),
('ClinicManager');


INSERT INTO clinics (
    name,
    address,
    phone,
	logo_url,
    verification_status,
    created_at
)
VALUES
  ('AURA Eye Clinic Central', '123 Nguyen Trai, HCM', '0909000001','https://example.com/logos/clinic1.png', 'verified', GETDATE()),
  ('AURA Eye Clinic South', '789 South Road, Can Tho', '0292123456','https://example.com/logos/clinic3.png', 'pending', GETDATE()),
  ('AURA Eye Clinic North', '456 Le Loi, HCM', '02498765432', 'https://example.com/logos/clinic2.png', 'verified', GETDATE());

-- Admin Account
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('admin@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 1, NULL, 'active', GETDATE());

-- Doctor Accounts
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
VALUES 
	('doctor1@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 2, 'active', GETDATE()),
	('doctor2@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 2, 'active', GETDATE()),
	('doctor3@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 1, 'active', GETDATE()),
	('doctor4@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 1, 'active', GETDATE()),
	('doctor5@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 1, 'active', GETDATE()),
	('doctor6@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 3, 'active', GETDATE()),
	('doctor7@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 2, 3, 'active', GETDATE());


-- Patient Accounts
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
VALUES 
	('patient1@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 1, 'active', GETDATE()),
	('patient2@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 1, 'active', GETDATE()),
	('patient3@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 1, 'active', GETDATE()),
	('patient4@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 2, 'active', GETDATE()),
	('patient5@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 2, 'active', GETDATE()),
	('patient6@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 2, 'active', GETDATE()),
	('patient7@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 2, 'active', GETDATE()),
	('patient8@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 2, 'active', GETDATE()),
	('patient9@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 3, 'active', GETDATE()),
	('patient10@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 3, 'active', GETDATE()),
	('patient11@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 3, 'active', GETDATE()),
	('patient12@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 3, 3, 'active', GETDATE());


-- Clinic Manager Account
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
VALUES 
	('clinic1@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 4, 1, 'active', GETDATE()),
	('clinic2@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 4, 2, 'active', GETDATE()),
	('clinic3@aura.com', '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu', 4, 3, 'active', GETDATE());


-- DOCTOR PROFILES

    INSERT INTO doctor_profiles (account_id, doctor_name, specialization, license_number)
VALUES 
	( '2','Dr. Nguyen Van A', 'Retinal Specialist', 'DOC-LICENSE-001'),
	( '3','Dr. Tran Thi B', 'Ophthalmologist', 'DOC-LICENSE-002'),
	( '4','Dr. Le Van C', 'Retinal Specialist', 'DOC-LICENSE-003'),
	( '5','Dr. Pham Thi D', 'Ophthalmologist', 'DOC-LICENSE-004'),
	( '6','Dr. Hoang Van E', 'Retinal Specialist', 'DOC-LICENSE-005'),
	( '7','Dr. Vo Thi F', 'Ophthalmologist', 'DOC-LICENSE-006'),
	( '8','Dr. Dang Van G', 'Retinal Specialist', 'DOC-LICENSE-007');


-- PATIENT PROFILES

    INSERT INTO patient_profiles (account_id, patient_name, date_of_birth, gender, medical_history)
VALUES 
	('9',  'Nguyen Van Dung',   '1980-01-15', 'Male',   'Diabetes Type 2, Hypertension'),
	('10', 'Tran Thi Lan',     '1975-05-20', 'Female', 'Glaucoma family history'),
	('11', 'Le Van Minh',      '1990-08-10', 'Male',   'No significant medical history'),
	('12', 'Pham Thi Hoa',     '1985-03-22', 'Female', 'Myopia'),
	('13', 'Vo Van Tuan',      '1992-11-05', 'Male',   'Hypertension'),
	('14', 'Vo Thi Mai',       '1995-07-14', 'Female', 'None'),
	('15', 'Bui Thi Ngoc',     '1988-02-18', 'Female', 'Family history of AMD'),
	('16', 'Nguyen Van Phuc',  '1979-06-25', 'Male',   'Hypertension, High cholesterol'),
	('17', 'Tran Van Long',    '1983-09-12', 'Male',   'Diabetes Type 2'),
	('18', 'Le Thi Thao',      '1991-04-30', 'Female', 'Myopia'),
	('19', 'Pham Van Khoa',    '1972-12-08', 'Male',   'Glaucoma family history'),
	('20', 'Nguyen Thi Yen',   '1998-01-19', 'Female', 'No significant medical history');


-- AI_MODEL_VERSIONS

	INSERT INTO ai_model_versions ( model_name, version, threshold_config, trained_at, active_flag)
VALUES 
	('AURA Retinal Analysis Model', 'v1.0.0', '{"high_risk_threshold": 0.8, "medium_risk_threshold": 0.5, "low_risk_threshold": 0.2}', DATEADD(day, -30, GETDATE()), 1),
	('AURA Retinal Analysis Model', 'v2.0.0', '{"high_risk_threshold": 0.85, "medium_risk_threshold": 0.5}', DATEADD(day, -7, GETDATE()), 0);


--RETINAL_IMAGES (12 patients, 1 ảnh/patient) 

    INSERT INTO retinal_images ( patient_id, clinic_id, uploaded_by, image_type, eye_side, image_url, upload_time, status)
 VALUES 
	(1, 1, 1, 'fundus', 'right', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(2, 1, 2, 'oct', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(3, 1, 3, 'fundus', 'right', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(4, 1, 4, 'oct', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(5, 2, 5, 'fundus', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(6, 2, 6, 'oct', 'right', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(7, 2, 7, 'fundus', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(8, 2, 8, 'fundus', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(9, 3, 9, 'oct', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(10, 3, 10, 'fundus', 'right', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(11, 3, 11, 'oct', 'right', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded'),
	(12, 3, 12, 'oct', 'left', 'https://example.com/images/p1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded');



--11. AI_ANALYSIS

    INSERT INTO ai_analysis (image_id, ai_model_version_id, analysis_time, processing_time, status)
VALUES
	(1, 1, DATEADD(day, -5, GETDATE()), 10, 'completed'),
	(2, 1, DATEADD(day, -5, GETDATE()), 13, 'completed'),
	(3, 1, DATEADD(day, -5, GETDATE()), 11, 'completed'),
	(4, 1, DATEADD(day, -5, GETDATE()), 13, 'completed'),
	(5, 1, DATEADD(day, -5, GETDATE()), 14, 'completed'),
	(6, 1, DATEADD(day, -5, GETDATE()), 13, 'completed'),
	(7, 1, DATEADD(day, -5, GETDATE()), 15, 'completed'),
	(8, 1, DATEADD(day, -5, GETDATE()), 15, 'completed'),
	(9, 1, DATEADD(day, -5, GETDATE()), 15, 'completed'),
	(10, 1, DATEADD(day, -5, GETDATE()), 10, 'completed'),
	(11, 1, DATEADD(day, -5, GETDATE()), 15, 'completed'),
	(12, 1, DATEADD(day, -3, GETDATE()), 12, 'completed');


--AI_RESULTS (1 per analysis = 12 results: 4 high, 4 medium, 4 low)

    INSERT INTO ai_results (analysis_id, disease_type, risk_level, confidence_score)
    SELECT a.analysis_id,
           CASE (a.analysis_id % 3) WHEN 0 THEN 'Diabetic Retinopathy' WHEN 1 THEN 'Glaucoma' ELSE 'Normal' END,
           CASE (a.analysis_id % 3) WHEN 0 THEN 'high' WHEN 1 THEN 'medium' ELSE 'low' END,
           CASE (a.analysis_id % 3) WHEN 0 THEN 0.88 WHEN 1 THEN 0.62 ELSE 0.18 END
    FROM ai_analysis a
    WHERE NOT EXISTS (SELECT 1 FROM ai_results r WHERE r.analysis_id = a.analysis_id);


-- AI_ANNOTATIONS (1 per analysis = 12)

    INSERT INTO ai_annotations (analysis_id, heatmap_url, description)
    SELECT a.analysis_id, 'https://example.com/heatmaps/heatmap_' + CAST(a.analysis_id AS VARCHAR) + '.png',
           CASE (a.analysis_id % 3) WHEN 0 THEN 'High risk region' WHEN 1 THEN 'Medium risk' ELSE 'Low risk / Normal' END
    FROM ai_analysis a
    WHERE NOT EXISTS (SELECT 1 FROM ai_annotations aa WHERE aa.analysis_id = a.analysis_id);


-- DOCTOR_REVIEWS (1 per analysis = 12, xoay 7 bác sĩ)

BEGIN
    ;WITH a AS (SELECT analysis_id, ROW_NUMBER() OVER (ORDER BY analysis_id) AS rn FROM ai_analysis),
         d AS (SELECT doctor_id, ROW_NUMBER() OVER (ORDER BY doctor_id) AS rn FROM doctor_profiles)
    INSERT INTO doctor_reviews (analysis_id, doctor_id, validation_status, comment, reviewed_at)
    SELECT a.analysis_id, (SELECT TOP 1 doctor_id FROM d WHERE d.rn = ((a.rn - 1) % 7) + 1), 'approved', 'Reviewed.', DATEADD(day, -1, GETDATE())
    FROM a
    WHERE NOT EXISTS (SELECT 1 FROM doctor_reviews dr WHERE dr.analysis_id = a.analysis_id);
END
GO


-- MEDICAL_REPORTS (1 per analysis = 12)
    INSERT INTO medical_reports (patient_id, analysis_id, doctor_id, report_url, created_at)
    SELECT i.patient_id, a.analysis_id, dr.doctor_id, 'https://example.com/reports/report_' + CAST(a.analysis_id AS VARCHAR) + '.pdf', DATEADD(day, -1, GETDATE())
    FROM ai_analysis a
    INNER JOIN retinal_images i ON i.image_id = a.image_id
    INNER JOIN doctor_reviews dr ON dr.analysis_id = a.analysis_id
    WHERE NOT EXISTS (SELECT 1 FROM medical_reports mr WHERE mr.analysis_id = a.analysis_id);



-- SERVICE_PACKAGES for patient

INSERT INTO dbo.service_packages (name, price, image_limit, duration_days)
VALUES
(N'Basic Package', 99000, 10, 30),
(N'Standard Package', 199000, 30, 30),
(N'Premium Package', 399000, 100, 30),
(N'Pro 3 Months', 999000, 300, 90),
(N'Pro 6 Months', 1799000.00, 700, 180);

-- SERVICE_PACKAGES for clinic
INSERT INTO dbo.service_packages (name, price, image_limit, duration_days)
VALUES 
	('Basic', 50000000, 10000, 365),
	( 'Standard', 100000000, 25000, 365),
	( 'Premium', 120000000, 29000, 365);


-- SUBSCRIPTIONS clinic
INSERT INTO subscriptions (account_id, package_id, remaining_credits, status)
VALUES 
	(21, 11, 10000, 'active'),
	(22, 12, 25000, 'active'),
	(23, 13, 29000, 'active');

-- SUBSCRIPTIONS patient
INSERT INTO subscriptions (account_id, package_id, remaining_credits, status)
VALUES 
	(9, 14, 10, 'active'),
	(10, 15, 30, 'active'),
	(11, 16, 100, 'active'),
	(12, 16, 100, 'active'),
	(13, 17, 300, 'active'),
	(14, 18, 700, 'active'),
	(15, 14, 10, 'active'),
	(16, 15, 30, 'active'),
	(17, 15, 30, 'active'),
	(18, 16, 100, 'active'),
	(19, 17, 300, 'active'),
	(20, 14, 10, 'active');


-- Clinic payments 
INSERT INTO payments (subscription_id, amount, payment_method, payment_time, status)
VALUES 
	(2, 50000000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(3, 100000000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(4, 120000000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed');


-- Patient payments
INSERT INTO payments (subscription_id, amount, payment_method, payment_time, status)
VALUES 
	(6, 99000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(7, 99000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(8, 99000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(9, 199000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(10, 199000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(11, 199000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(12, 399000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(13, 399000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(14, 399000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(15, 999000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(16, 999000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed'),
	(17, 1799000, 'bank_transfer', DATEADD(day, -60, GETDATE()), 'completed');


--  CONVERSATIONS
INSERT INTO conversations (patient_id, doctor_id, created_at, status)
VALUES
(1, 1,  DATEADD(day, -19, GETDATE()), 'active'),
(2, 2,  DATEADD(day, -18, GETDATE()), 'active'),
(3, 3,  DATEADD(day, -17, GETDATE()), 'active'),
(4, 4,  DATEADD(day, -16, GETDATE()), 'active'),
(5, 5,  DATEADD(day, -15, GETDATE()), 'active'),
(6, 6,  DATEADD(day, -14, GETDATE()), 'active'),
(7, 7,  DATEADD(day, -13, GETDATE()), 'active'),
(8, 1,  DATEADD(day, -12, GETDATE()), 'active'),
(9, 2,  DATEADD(day, -11, GETDATE()), 'active'),
(10, 3, DATEADD(day, -10, GETDATE()), 'active'),
(11, 4, DATEADD(day, -9,  GETDATE()), 'active'),
(12, 5, DATEADD(day, -8,  GETDATE()), 'active');

-- MESSAGES (2 per conversation = 24: patient hỏi + doctor trả lời) 

    INSERT INTO messages (conversation_id, sender_type, sender_name, content, message_type, sent_at)
    SELECT c.conversation_id, 'patient', pp.patient_name, 'Xin bác sĩ tư vấn kết quả phân tích ảnh.', 'text', DATEADD(day, -2, GETDATE())
    FROM conversations c INNER JOIN patient_profiles pp ON pp.patient_id = c.patient_id
    WHERE NOT EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.conversation_id AND m.sender_type = 'patient');



    INSERT INTO messages (conversation_id, sender_type, sender_name, content, message_type, sent_at)
    SELECT c.conversation_id, 'doctor', dp.doctor_name, 'Đã xem. Bệnh nhân nên tái khám theo lịch. Đã gửi báo cáo.', 'text', DATEADD(day, -1, GETDATE())
    FROM conversations c INNER JOIN doctor_profiles dp ON dp.doctor_id = c.doctor_id
    WHERE NOT EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.conversation_id AND m.sender_type = 'doctor');
