-- ============================================
-- AURA Phase 1 Test Data Script
-- Database: RetinalHealthDB (SQL Server)
-- Purpose: Create test data for Phase 1 testing
-- ============================================

USE RetinalHealthDB;
GO

-- ============================================
-- 1. CLEAR EXISTING DATA (Optional - Uncomment if needed)
-- ============================================
/*
DELETE FROM medical_reports;
DELETE FROM ai_results;
DELETE FROM ai_analysis;
DELETE FROM retinal_images;
DELETE FROM patient_profiles;
DELETE FROM doctor_profiles;
DELETE FROM accounts;
DELETE FROM ai_model_versions;
DELETE FROM clinics;
DELETE FROM roles;
GO
*/

-- ============================================
-- 2. INSERT ROLES (4 roles)
-- ============================================
IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = 1)
BEGIN
    INSERT INTO roles (role_id, role_name) VALUES (1, 'Admin');
END

IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = 2)
BEGIN
    INSERT INTO roles (role_id, role_name) VALUES (2, 'Doctor');
END

IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = 3)
BEGIN
    INSERT INTO roles (role_id, role_name) VALUES (3, 'Patient');
END

IF NOT EXISTS (SELECT 1 FROM roles WHERE role_id = 4)
BEGIN
    INSERT INTO roles (role_id, role_name) VALUES (4, 'ClinicManager');
END
GO

-- ============================================
-- 3. INSERT CLINICS (2 clinics)
-- ============================================
IF NOT EXISTS (SELECT 1 FROM clinics WHERE clinic_id = 1)
BEGIN
    INSERT INTO clinics (clinic_id, name, address, phone, logo_url, verification_status, created_at)
    VALUES (1, 'AURA Eye Clinic Central', '123 Main Street, Ho Chi Minh City', '02812345678', 
            'https://example.com/logos/clinic1.png', 'verified', GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM clinics WHERE clinic_id = 2)
BEGIN
    INSERT INTO clinics (clinic_id, name, address, phone, logo_url, verification_status, created_at)
    VALUES (2, 'AURA Eye Clinic North', '456 North Avenue, Hanoi', '02498765432', 
            'https://example.com/logos/clinic2.png', 'verified', GETDATE());
END
GO

-- ============================================
-- 4. INSERT ACCOUNTS (6 accounts)
-- Password for all: password123
-- Hash: $2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu
-- ============================================
DECLARE @password_hash NVARCHAR(255) = '$2b$12$GQNuo9BMG4Ll95zTxq6CkuJBgjBWf.2HWn6pIOOinisvKgUmReQmu';

-- Admin Account
IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'admin@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('admin@aura.com', @password_hash, 1, NULL, 'active', GETDATE());
END

-- Doctor Accounts
IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'doctor1@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('doctor1@aura.com', @password_hash, 2, 1, 'active', GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'doctor2@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('doctor2@aura.com', @password_hash, 2, 2, 'active', GETDATE());
END

-- Patient Accounts
IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'patient1@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('patient1@aura.com', @password_hash, 3, 1, 'active', GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'patient2@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('patient2@aura.com', @password_hash, 3, 1, 'active', GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'patient3@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('patient3@aura.com', @password_hash, 3, 2, 'active', GETDATE());
END

-- Clinic Manager Account
IF NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'clinic1@aura.com')
BEGIN
    INSERT INTO accounts (email, password_hash, role_id, clinic_id, status, created_at)
    VALUES ('clinic1@aura.com', @password_hash, 4, 1, 'active', GETDATE());
END
GO

-- ============================================
-- 5. INSERT DOCTOR PROFILES (2 profiles)
-- ============================================
DECLARE @doctor1_account_id BIGINT = (SELECT account_id FROM accounts WHERE email = 'doctor1@aura.com');
DECLARE @doctor2_account_id BIGINT = (SELECT account_id FROM accounts WHERE email = 'doctor2@aura.com');

IF @doctor1_account_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM doctor_profiles WHERE account_id = @doctor1_account_id)
BEGIN
    INSERT INTO doctor_profiles (account_id, doctor_name, specialization, license_number)
    VALUES (@doctor1_account_id, 'Dr. Nguyen Van A', 'Retinal Specialist', 'DOC-LICENSE-001');
END

IF @doctor2_account_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM doctor_profiles WHERE account_id = @doctor2_account_id)
BEGIN
    INSERT INTO doctor_profiles (account_id, doctor_name, specialization, license_number)
    VALUES (@doctor2_account_id, 'Dr. Tran Thi B', 'Ophthalmologist', 'DOC-LICENSE-002');
END
GO

-- ============================================
-- 6. INSERT PATIENT PROFILES (3 profiles)
-- ============================================
DECLARE @patient1_account_id BIGINT = (SELECT account_id FROM accounts WHERE email = 'patient1@aura.com');
DECLARE @patient2_account_id BIGINT = (SELECT account_id FROM accounts WHERE email = 'patient2@aura.com');
DECLARE @patient3_account_id BIGINT = (SELECT account_id FROM accounts WHERE email = 'patient3@aura.com');

IF @patient1_account_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM patient_profiles WHERE account_id = @patient1_account_id)
BEGIN
    INSERT INTO patient_profiles (account_id, patient_name, date_of_birth, gender, medical_history)
    VALUES (@patient1_account_id, 'Nguyen Van Patient 1', '1980-01-15', 'Male', 'Diabetes Type 2, Hypertension');
END

IF @patient2_account_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM patient_profiles WHERE account_id = @patient2_account_id)
BEGIN
    INSERT INTO patient_profiles (account_id, patient_name, date_of_birth, gender, medical_history)
    VALUES (@patient2_account_id, 'Tran Thi Patient 2', '1975-05-20', 'Female', 'Glaucoma family history');
END

IF @patient3_account_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM patient_profiles WHERE account_id = @patient3_account_id)
BEGIN
    INSERT INTO patient_profiles (account_id, patient_name, date_of_birth, gender, medical_history)
    VALUES (@patient3_account_id, 'Le Van Patient 3', '1990-08-10', 'Male', 'No significant medical history');
END
GO

-- ============================================
-- 7. INSERT AI MODEL VERSION (1 version)
-- ============================================
IF NOT EXISTS (SELECT 1 FROM ai_model_versions WHERE ai_model_version_id = 1)
BEGIN
    INSERT INTO ai_model_versions (ai_model_version_id, model_name, version, threshold_config, trained_at, active_flag)
    VALUES (1, 'AURA Retinal Analysis Model', 'v1.0.0', 
            '{"high_risk_threshold": 0.8, "medium_risk_threshold": 0.5, "low_risk_threshold": 0.2}', 
            DATEADD(day, -30, GETDATE()), 1);
END
GO

-- ============================================
-- 8. INSERT RETINAL IMAGES (3 images)
-- ============================================
DECLARE @patient1_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient1@aura.com'));
DECLARE @patient2_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient2@aura.com'));
DECLARE @patient3_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient3@aura.com'));
DECLARE @doctor1_id BIGINT = (SELECT account_id FROM accounts WHERE email = 'doctor1@aura.com');
DECLARE @image1_id BIGINT;
DECLARE @image2_id BIGINT;
DECLARE @image3_id BIGINT;

-- Image 1: Patient 1 - Left Eye - Fundus (HIGH RISK)
IF @patient1_id IS NOT NULL AND @doctor1_id IS NOT NULL 
   AND NOT EXISTS (SELECT 1 FROM retinal_images WHERE patient_id = @patient1_id AND eye_side = 'left' AND image_type = 'fundus')
BEGIN
    INSERT INTO retinal_images (patient_id, clinic_id, uploaded_by, image_type, eye_side, image_url, upload_time, status)
    VALUES (@patient1_id, 1, @doctor1_id, 'fundus', 'left', 
            'https://example.com/images/patient1_left_fundus.jpg', DATEADD(day, -5, GETDATE()), 'uploaded');
    SET @image1_id = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SET @image1_id = (SELECT image_id FROM retinal_images WHERE patient_id = @patient1_id AND eye_side = 'left' AND image_type = 'fundus');
END

-- Image 2: Patient 2 - Right Eye - Fundus (MEDIUM RISK)
IF @patient2_id IS NOT NULL AND @doctor1_id IS NOT NULL 
   AND NOT EXISTS (SELECT 1 FROM retinal_images WHERE patient_id = @patient2_id AND eye_side = 'right' AND image_type = 'fundus')
BEGIN
    INSERT INTO retinal_images (patient_id, clinic_id, uploaded_by, image_type, eye_side, image_url, upload_time, status)
    VALUES (@patient2_id, 1, @doctor1_id, 'fundus', 'right', 
            'https://example.com/images/patient2_right_fundus.jpg', DATEADD(day, -3, GETDATE()), 'uploaded');
    SET @image2_id = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SET @image2_id = (SELECT image_id FROM retinal_images WHERE patient_id = @patient2_id AND eye_side = 'right' AND image_type = 'fundus');
END

-- Image 3: Patient 3 - Left Eye - OCT (LOW RISK)
IF @patient3_id IS NOT NULL AND @doctor1_id IS NOT NULL 
   AND NOT EXISTS (SELECT 1 FROM retinal_images WHERE patient_id = @patient3_id AND eye_side = 'left' AND image_type = 'oct')
BEGIN
    INSERT INTO retinal_images (patient_id, clinic_id, uploaded_by, image_type, eye_side, image_url, upload_time, status)
    VALUES (@patient3_id, 2, @doctor1_id, 'oct', 'left', 
            'https://example.com/images/patient3_left_oct.jpg', DATEADD(day, -1, GETDATE()), 'uploaded');
    SET @image3_id = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SET @image3_id = (SELECT image_id FROM retinal_images WHERE patient_id = @patient3_id AND eye_side = 'left' AND image_type = 'oct');
END
GO

-- ============================================
-- 9. INSERT AI ANALYSES (3 analyses)
-- ============================================
DECLARE @model_version_id INT = 1;
DECLARE @patient1_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient1@aura.com'));
DECLARE @patient2_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient2@aura.com'));
DECLARE @patient3_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient3@aura.com'));
DECLARE @image1_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient1_id AND eye_side = 'left' AND image_type = 'fundus');
DECLARE @image2_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient2_id AND eye_side = 'right' AND image_type = 'fundus');
DECLARE @image3_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient3_id AND eye_side = 'left' AND image_type = 'oct');
DECLARE @analysis1_id BIGINT;
DECLARE @analysis2_id BIGINT;
DECLARE @analysis3_id BIGINT;

-- Analysis 1: For Image 1 (HIGH RISK)
IF @image1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ai_analysis WHERE image_id = @image1_id)
BEGIN
    INSERT INTO ai_analysis (image_id, ai_model_version_id, analysis_time, processing_time, status)
    VALUES (@image1_id, @model_version_id, DATEADD(day, -5, GETDATE()), 15, 'completed');
    SET @analysis1_id = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SET @analysis1_id = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image1_id);
END

-- Analysis 2: For Image 2 (MEDIUM RISK)
IF @image2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ai_analysis WHERE image_id = @image2_id)
BEGIN
    INSERT INTO ai_analysis (image_id, ai_model_version_id, analysis_time, processing_time, status)
    VALUES (@image2_id, @model_version_id, DATEADD(day, -3, GETDATE()), 12, 'completed');
    SET @analysis2_id = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SET @analysis2_id = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image2_id);
END

-- Analysis 3: For Image 3 (LOW RISK)
IF @image3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ai_analysis WHERE image_id = @image3_id)
BEGIN
    INSERT INTO ai_analysis (image_id, ai_model_version_id, analysis_time, processing_time, status)
    VALUES (@image3_id, @model_version_id, DATEADD(day, -1, GETDATE()), 10, 'completed');
    SET @analysis3_id = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SET @analysis3_id = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image3_id);
END
GO

-- ============================================
-- 10. INSERT AI RESULTS (3 results: high, medium, low risk)
-- ============================================
DECLARE @patient1_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient1@aura.com'));
DECLARE @patient2_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient2@aura.com'));
DECLARE @patient3_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient3@aura.com'));
DECLARE @image1_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient1_id AND eye_side = 'left' AND image_type = 'fundus');
DECLARE @image2_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient2_id AND eye_side = 'right' AND image_type = 'fundus');
DECLARE @image3_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient3_id AND eye_side = 'left' AND image_type = 'oct');
DECLARE @analysis1_id BIGINT = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image1_id);
DECLARE @analysis2_id BIGINT = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image2_id);
DECLARE @analysis3_id BIGINT = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image3_id);

-- Result 1: HIGH RISK - Diabetic Retinopathy
IF @analysis1_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ai_results WHERE analysis_id = @analysis1_id)
BEGIN
    INSERT INTO ai_results (analysis_id, disease_type, risk_level, confidence_score)
    VALUES (@analysis1_id, 'Diabetic Retinopathy', 'high', 0.92);
END

-- Result 2: MEDIUM RISK - Glaucoma
IF @analysis2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ai_results WHERE analysis_id = @analysis2_id)
BEGIN
    INSERT INTO ai_results (analysis_id, disease_type, risk_level, confidence_score)
    VALUES (@analysis2_id, 'Glaucoma', 'medium', 0.65);
END

-- Result 3: LOW RISK - Normal
IF @analysis3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ai_results WHERE analysis_id = @analysis3_id)
BEGIN
    INSERT INTO ai_results (analysis_id, disease_type, risk_level, confidence_score)
    VALUES (@analysis3_id, 'Normal', 'low', 0.15);
END
GO

-- ============================================
-- 11. INSERT MEDICAL REPORTS (3 reports)
-- ============================================
DECLARE @patient1_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient1@aura.com'));
DECLARE @patient2_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient2@aura.com'));
DECLARE @patient3_id BIGINT = (SELECT patient_id FROM patient_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'patient3@aura.com'));
DECLARE @doctor1_profile_id BIGINT = (SELECT doctor_id FROM doctor_profiles WHERE account_id = (SELECT account_id FROM accounts WHERE email = 'doctor1@aura.com'));
DECLARE @image1_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient1_id AND eye_side = 'left' AND image_type = 'fundus');
DECLARE @image2_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient2_id AND eye_side = 'right' AND image_type = 'fundus');
DECLARE @image3_id BIGINT = (SELECT image_id FROM retinal_images WHERE patient_id = @patient3_id AND eye_side = 'left' AND image_type = 'oct');
DECLARE @analysis1_id BIGINT = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image1_id);
DECLARE @analysis2_id BIGINT = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image2_id);
DECLARE @analysis3_id BIGINT = (SELECT analysis_id FROM ai_analysis WHERE image_id = @image3_id);

-- Report 1: Patient 1 - HIGH RISK (Diabetic Retinopathy)
IF @patient1_id IS NOT NULL AND @doctor1_profile_id IS NOT NULL AND @analysis1_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM medical_reports WHERE analysis_id = @analysis1_id)
BEGIN
    INSERT INTO medical_reports (patient_id, analysis_id, doctor_id, report_url, created_at)
    VALUES (@patient1_id, @analysis1_id, @doctor1_profile_id, 
            'https://example.com/reports/report_1.pdf', DATEADD(day, -4, GETDATE()));
END

-- Report 2: Patient 2 - MEDIUM RISK (Glaucoma)
IF @patient2_id IS NOT NULL AND @doctor1_profile_id IS NOT NULL AND @analysis2_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM medical_reports WHERE analysis_id = @analysis2_id)
BEGIN
    INSERT INTO medical_reports (patient_id, analysis_id, doctor_id, report_url, created_at)
    VALUES (@patient2_id, @analysis2_id, @doctor1_profile_id, 
            'https://example.com/reports/report_2.pdf', DATEADD(day, -2, GETDATE()));
END

-- Report 3: Patient 3 - LOW RISK (Normal)
IF @patient3_id IS NOT NULL AND @doctor1_profile_id IS NOT NULL AND @analysis3_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM medical_reports WHERE analysis_id = @analysis3_id)
BEGIN
    INSERT INTO medical_reports (patient_id, analysis_id, doctor_id, report_url, created_at)
    VALUES (@patient3_id, @analysis3_id, @doctor1_profile_id, 
            'https://example.com/reports/report_3.pdf', GETDATE());
END
GO

-- ============================================
-- 12. VERIFY DATA
-- ============================================
PRINT '========================================';
PRINT 'Data Insertion Complete!';
PRINT '========================================';
PRINT 'Roles: ' + CAST((SELECT COUNT(*) FROM roles) AS VARCHAR);
PRINT 'Clinics: ' + CAST((SELECT COUNT(*) FROM clinics) AS VARCHAR);
PRINT 'Accounts: ' + CAST((SELECT COUNT(*) FROM accounts) AS VARCHAR);
PRINT 'Doctor Profiles: ' + CAST((SELECT COUNT(*) FROM doctor_profiles) AS VARCHAR);
PRINT 'Patient Profiles: ' + CAST((SELECT COUNT(*) FROM patient_profiles) AS VARCHAR);
PRINT 'AI Model Versions: ' + CAST((SELECT COUNT(*) FROM ai_model_versions) AS VARCHAR);
PRINT 'Retinal Images: ' + CAST((SELECT COUNT(*) FROM retinal_images) AS VARCHAR);
PRINT 'AI Analyses: ' + CAST((SELECT COUNT(*) FROM ai_analysis) AS VARCHAR);
PRINT 'AI Results: ' + CAST((SELECT COUNT(*) FROM ai_results) AS VARCHAR);
PRINT 'Medical Reports: ' + CAST((SELECT COUNT(*) FROM medical_reports) AS VARCHAR);
PRINT '========================================';
GO

-- ============================================
-- 13. TEST ACCOUNTS SUMMARY
-- ============================================
PRINT '';
PRINT 'Test Accounts (Password: password123):';
PRINT '----------------------------------------';
PRINT 'Admin: admin@aura.com';
PRINT 'Doctor 1: doctor1@aura.com (Clinic 1)';
PRINT 'Doctor 2: doctor2@aura.com (Clinic 2)';
PRINT 'Patient 1: patient1@aura.com (Clinic 1)';
PRINT 'Patient 2: patient2@aura.com (Clinic 1)';
PRINT 'Patient 3: patient3@aura.com (Clinic 2)';
PRINT 'Clinic Manager: clinic1@aura.com (Clinic 1)';
PRINT '----------------------------------------';
GO

-- ============================================
-- 14. MEDICAL REPORTS SUMMARY
-- ============================================
PRINT '';
PRINT 'Medical Reports for Testing:';
PRINT '----------------------------------------';
PRINT 'Report ID 1: HIGH RISK (Diabetic Retinopathy) - Patient 1';
PRINT 'Report ID 2: MEDIUM RISK (Glaucoma) - Patient 2';
PRINT 'Report ID 3: LOW RISK (Normal) - Patient 3';
PRINT '----------------------------------------';
GO

