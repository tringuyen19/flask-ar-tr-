# 🧪 Hướng Dẫn Test Phase 1 - User Functional Requirements

## 📋 Tổng Quan

Phase 1 bao gồm 4 tính năng chính:
1. ✅ **JWT Authentication** - Đăng ký, đăng nhập, lấy thông tin user
2. ✅ **Bulk Image Upload** - Upload nhiều ảnh võng mạc cùng lúc
3. ✅ **Export Reports** - Xuất báo cáo PDF/CSV
4. ✅ **Automated Recommendations** - Tự động tạo khuyến nghị dựa trên risk_level

---

## 🚀 Bước 1: Setup và Khởi Động Server

### 1.1. Kích hoạt Virtual Environment
```powershell
cd src
.venv\Scripts\activate.ps1
```

### 1.2. Cài đặt Dependencies (nếu chưa có)
```powershell
pip install -r requirements.txt
```

### 1.3. Chạy Server
```powershell
python app.py
```

Server sẽ chạy tại: **http://localhost:9999**

### 1.4. Kiểm tra Server
```bash
# Health check
curl http://localhost:9999/health

# Hoặc mở trình duyệt
http://localhost:9999/docs  # Swagger UI
```

---

## 🔐 Bước 2: Test JWT Authentication

### 2.1. Đăng Ký User Mới (Register)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "patient1@example.com",
  "password": "password123",
  "role_id": 3,
  "clinic_id": 1
}
```

**Test với cURL:**
```bash
curl -X POST http://localhost:9999/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"patient1@example.com\",
    \"password\": \"password123\",
    \"role_id\": 3,
    \"clinic_id\": 1
  }"
```

**Response thành công (201):**
```json
{
  "message": "Account created successfully",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "account_id": 1,
    "email": "patient1@example.com",
    "role_id": 3,
    "clinic_id": 1
  }
}
```

**Lưu `access_token` để dùng cho các request sau!**

**Role IDs:**
- `1` = Admin
- `2` = Doctor
- `3` = Patient
- `4` = ClinicManager

---

### 2.2. Đăng Nhập (Login)

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "patient1@example.com",
  "password": "password123"
}
```

**Test với cURL:**
```bash
curl -X POST http://localhost:9999/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"patient1@example.com\",
    \"password\": \"password123\"
  }"
```

**Response thành công (200):**
```json
{
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "account_id": 1,
    "email": "patient1@example.com",
    "role_id": 3,
    "clinic_id": 1
  }
}
```

---

### 2.3. Lấy Thông Tin User Hiện Tại (Me)

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Test với cURL:**
```bash
curl -X GET http://localhost:9999/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response thành công (200):**
```json
{
  "message": "User information retrieved successfully",
  "data": {
    "account_id": 1,
    "email": "patient1@example.com",
    "role_id": 3,
    "clinic_id": 1,
    "status": "active",
    "created_at": "2024-01-15T10:30:00"
  }
}
```

**Test không có token (401):**
```bash
curl -X GET http://localhost:9999/api/auth/me
# Response: {"error": "Authentication required. Please provide a valid token."}
```

---

## 📸 Bước 3: Test Bulk Image Upload

### 3.1. Upload Nhiều Ảnh Cùng Lúc

**Endpoint:** `POST /api/retinal-images/bulk`

**Request Body:**
```json
{
  "images": [
    {
      "patient_id": 1,
      "clinic_id": 1,
      "uploaded_by": 1,
      "image_type": "fundus",
      "eye_side": "left",
      "image_url": "https://example.com/image1.jpg",
      "status": "uploaded"
    },
    {
      "patient_id": 1,
      "clinic_id": 1,
      "uploaded_by": 1,
      "image_type": "fundus",
      "eye_side": "right",
      "image_url": "https://example.com/image2.jpg",
      "status": "uploaded"
    },
    {
      "patient_id": 2,
      "clinic_id": 1,
      "uploaded_by": 1,
      "image_type": "oct",
      "eye_side": "left",
      "image_url": "https://example.com/image3.jpg",
      "status": "uploaded"
    }
  ]
}
```

**Test với cURL:**
```bash
curl -X POST http://localhost:9999/api/retinal-images/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d "{
    \"images\": [
      {
        \"patient_id\": 1,
        \"clinic_id\": 1,
        \"uploaded_by\": 1,
        \"image_type\": \"fundus\",
        \"eye_side\": \"left\",
        \"image_url\": \"https://example.com/image1.jpg\",
        \"status\": \"uploaded\"
      },
      {
        \"patient_id\": 1,
        \"clinic_id\": 1,
        \"uploaded_by\": 1,
        \"image_type\": \"fundus\",
        \"eye_side\": \"right\",
        \"image_url\": \"https://example.com/image2.jpg\",
        \"status\": \"uploaded\"
      }
    ]
  }"
```

**Response thành công (201):**
```json
{
  "message": "Bulk upload completed: 2 successful, 0 failed",
  "data": {
    "uploaded": [
      {
        "image_id": 1,
        "patient_id": 1,
        "clinic_id": 1,
        "image_type": "fundus",
        "eye_side": "left",
        "image_url": "https://example.com/image1.jpg",
        "status": "uploaded",
        "uploaded_at": "2024-01-15T10:30:00"
      },
      {
        "image_id": 2,
        "patient_id": 1,
        "clinic_id": 1,
        "image_type": "fundus",
        "eye_side": "right",
        "image_url": "https://example.com/image2.jpg",
        "status": "uploaded",
        "uploaded_at": "2024-01-15T10:30:00"
      }
    ],
    "errors": [],
    "total": 2,
    "success_count": 2,
    "error_count": 0
  }
}
```

**Response có lỗi (một số ảnh fail):**
```json
{
  "message": "Bulk upload completed: 1 successful, 1 failed",
  "data": {
    "uploaded": [...],
    "errors": [
      {
        "image_url": "https://example.com/image2.jpg",
        "error": "Patient not found"
      }
    ],
    "total": 2,
    "success_count": 1,
    "error_count": 1
  }
}
```

---

## 📄 Bước 4: Test Export Reports

### 4.1. Export PDF Report

**Endpoint:** `GET /api/medical-reports/{report_id}/export?format=pdf`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Test với cURL:**
```bash
curl -X GET "http://localhost:9999/api/medical-reports/1/export?format=pdf" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  --output medical_report_1.pdf
```

**Response:**
- Content-Type: `application/pdf`
- File sẽ được download với tên `medical_report_1.pdf`

**Test với trình duyệt:**
```
http://localhost:9999/api/medical-reports/1/export?format=pdf
```
(Đảm bảo đã login và có token trong cookie/header)

---

### 4.2. Export CSV Report

**Endpoint:** `GET /api/medical-reports/{report_id}/export?format=csv`

**Test với cURL:**
```bash
curl -X GET "http://localhost:9999/api/medical-reports/1/export?format=csv" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  --output medical_report_1.csv
```

**Response:**
- Content-Type: `text/csv`
- File sẽ được download với tên `medical_report_1.csv`

---

## 🤖 Bước 5: Test Automated Recommendations

### 5.1. Recommendations được tự động generate trong Export

**Logic:**
- **High Risk** → "⚠️ HIGH RISK DETECTED: Immediate consultation..."
- **Medium Risk** → "⚠️ MODERATE RISK: Regular monitoring..."
- **Low Risk** → "✅ LOW RISK: Continue with regular eye checkups..."

### 5.2. Test với các Risk Levels khác nhau

**Cần có data trong database:**
1. Tạo `ai_analysis` với `analysis_id`
2. Tạo `ai_result` với `risk_level` = "high", "medium", hoặc "low"
3. Tạo `medical_report` liên kết với `analysis_id`

**Test High Risk:**
```bash
# Export PDF/CSV sẽ có recommendations cho HIGH RISK
curl -X GET "http://localhost:9999/api/medical-reports/1/export?format=pdf" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  --output report_high_risk.pdf
```

**Kiểm tra nội dung PDF/CSV:**
- Mở file và tìm phần "Recommendations"
- Verify nội dung khuyến nghị phù hợp với risk_level

---

## 🧪 Test Cases Checklist

### ✅ Authentication Tests
- [ ] Register user mới thành công
- [ ] Register với email đã tồn tại → Error 400
- [ ] Register với role_id không hợp lệ → Error 404
- [ ] Login với email/password đúng → Nhận token
- [ ] Login với email/password sai → Error 401
- [ ] GET /me với token hợp lệ → Trả về user info
- [ ] GET /me không có token → Error 401
- [ ] GET /me với token không hợp lệ → Error 401

### ✅ Bulk Upload Tests
- [ ] Upload 1 ảnh thành công
- [ ] Upload nhiều ảnh thành công
- [ ] Upload với patient_id không tồn tại → Error 404
- [ ] Upload với clinic_id không tồn tại → Error 404
- [ ] Upload một số ảnh thành công, một số fail → Trả về cả success và errors
- [ ] Upload với dữ liệu không hợp lệ → Validation error

### ✅ Export Reports Tests
- [ ] Export PDF thành công → Download file PDF
- [ ] Export CSV thành công → Download file CSV
- [ ] Export với format không hợp lệ → Error 400
- [ ] Export với report_id không tồn tại → Error 404
- [ ] Export không có token → Error 401

### ✅ Automated Recommendations Tests
- [ ] Export report với HIGH risk → Recommendations cho immediate consultation
- [ ] Export report với MEDIUM risk → Recommendations cho follow-up 1-2 months
- [ ] Export report với LOW risk → Recommendations cho regular checkups
- [ ] Export report không có risk_level → Default LOW risk recommendations

---

## 🛠️ Tools để Test

### 1. **Swagger UI** (Recommended)
```
http://localhost:9999/docs
```
- Test trực tiếp trên browser
- Có thể nhập token vào "Authorize"
- Xem request/response schemas

### 2. **Postman**
- Import collection từ Swagger
- Tạo environment variables cho token
- Chạy test automation

### 3. **cURL** (Command Line)
- Test nhanh từ terminal
- Dễ script hóa

### 4. **Python Requests** (Script)
```python
import requests

BASE_URL = "http://localhost:9999"
token = None

# 1. Register
response = requests.post(f"{BASE_URL}/api/auth/register", json={
    "email": "test@example.com",
    "password": "password123",
    "role_id": 3
})
token = response.json()["data"]["access_token"]

# 2. Login
response = requests.post(f"{BASE_URL}/api/auth/login", json={
    "email": "test@example.com",
    "password": "password123"
})
token = response.json()["data"]["access_token"]

# 3. Get Me
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
print(response.json())

# 4. Bulk Upload
response = requests.post(
    f"{BASE_URL}/api/retinal-images/bulk",
    headers=headers,
    json={
        "images": [
            {
                "patient_id": 1,
                "clinic_id": 1,
                "uploaded_by": 1,
                "image_type": "fundus",
                "eye_side": "left",
                "image_url": "https://example.com/image.jpg"
            }
        ]
    }
)
print(response.json())

# 5. Export PDF
response = requests.get(
    f"{BASE_URL}/api/medical-reports/1/export?format=pdf",
    headers=headers
)
with open("report.pdf", "wb") as f:
    f.write(response.content)
```

---

## ⚠️ Lưu Ý Khi Test

1. **Database phải có data:**
   
   **Cách 1: Chạy SQL Script (Khuyến nghị)**
   
   File `test_data_phase1.sql` đã được tạo sẵn với đầy đủ dữ liệu mẫu.
   
   **Cách chạy:**
   ```bash
   # Sử dụng sqlcmd (Windows)
   sqlcmd -S localhost -d RetinalHealthDB -i test_data_phase1.sql
   
   # Hoặc mở file trong SQL Server Management Studio và Execute
   ```
   
   **Script này sẽ tạo:**
   - ✅ **4 Roles** (Admin, Doctor, Patient, ClinicManager)
   - ✅ **2 Clinics** (clinic_id: 1, 2)
   - ✅ **6 Accounts** mẫu (password: `password123`)
     - 1 Admin: `admin@aura.com`
     - 2 Doctors: `doctor1@aura.com`, `doctor2@aura.com`
     - 3 Patients: `patient1@aura.com`, `patient2@aura.com`, `patient3@aura.com`
   - ✅ **2 Doctor Profiles**
   - ✅ **3 Patient Profiles**
   - ✅ **1 AI Model Version**
   - ✅ **3 Retinal Images**
   - ✅ **3 AI Analyses**
   - ✅ **3 AI Results** (high, medium, low risk)
   - ✅ **3 Medical Reports**
   
   **Lưu ý:** Tất cả accounts đều dùng password: `password123`
   
   **Cách 2: Tạo thủ công**
   
   Nếu muốn tạo thủ công, chạy các lệnh SQL sau:
   ```sql
   -- Roles
   INSERT INTO roles (role_id, role_name) VALUES
   (1, 'Admin'), (2, 'Doctor'), (3, 'Patient'), (4, 'ClinicManager');
   
   -- Clinics (QUAN TRỌNG: Phải tạo clinic trước khi register account với clinic_id)
   INSERT INTO clinics (clinic_id, name, address, phone, logo_url, verification_status, created_at)
   VALUES (1, 'Test Clinic', '123 Test St', '0123456789', 'https://example.com/logo.png', 'verified', GETDATE());
   ```

2. **Khi Register Account:**
   - Nếu cung cấp `clinic_id`, phải đảm bảo clinic đó tồn tại trong database
   - Nếu không có clinic, có thể bỏ qua `clinic_id` (để `null`) hoặc tạo clinic trước
   - Sau khi chạy `test_data_phase1.sql`, bạn có thể dùng `clinic_id: 1` hoặc `clinic_id: 2`

3. **Test Accounts sẵn có (sau khi chạy SQL script):**
   - `admin@aura.com` / `password123` (Role: Admin)
   - `doctor1@aura.com` / `password123` (Role: Doctor, clinic_id: 1)
   - `patient1@aura.com` / `password123` (Role: Patient, clinic_id: 1)
   - `clinic1@aura.com` / `password123` (Role: ClinicManager, clinic_id: 1)

4. **Test Medical Reports sẵn có:**
   - Report ID `1`: HIGH risk (Diabetic Retinopathy) → Test immediate consultation recommendation
   - Report ID `2`: MEDIUM risk (Glaucoma) → Test follow-up recommendation
   - Report ID `3`: LOW risk (Normal) → Test regular checkup recommendation

5. **Token JWT:**
   - Token có thời hạn (mặc định 24h)
   - Nếu token hết hạn, cần login lại

3. **Error Handling:**
   - Kiểm tra các error responses
   - Verify error messages rõ ràng

4. **Validation:**
   - Test với dữ liệu không hợp lệ
   - Test với missing required fields

---

## 📊 Kết Quả Mong Đợi

Sau khi test xong Phase 1, bạn sẽ có:
- ✅ JWT Authentication hoạt động đầy đủ
- ✅ Bulk upload xử lý nhiều ảnh cùng lúc
- ✅ Export PDF/CSV với formatting đẹp
- ✅ Recommendations tự động dựa trên risk_level

**Chúc bạn test thành công! 🎉**

