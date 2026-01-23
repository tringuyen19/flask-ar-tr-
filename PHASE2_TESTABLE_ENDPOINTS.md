# 🧪 Phase 2: Doctor Requirements - Các Chức Năng Có Thể Test Trên Swagger UI

## 🎯 Tổng Quan

**Swagger UI URL:** `http://localhost:9999/docs`

Tất cả các endpoints dưới đây đã có **Swagger docstrings đầy đủ** và có thể test trực tiếp trên Swagger UI.

---

## 📋 9 DOCTOR FUNCTIONAL REQUIREMENTS - Test Status

### **FR-13: Log in and Manage Assigned Patient Profiles** ✅ 100%

#### **1. Login (dùng chung với User)**
- **POST `/api/auth/login`** ✅
  - Body: `{"email": "doctor@example.com", "password": "password123"}`
  - Response: Access token

#### **2. Get Assigned Patients by Clinic**
- **GET `/api/patients/assigned/clinic/<clinic_id>`** ✅
  - **Mô tả:** Lấy tất cả patients được assign vào clinic
  - **Parameters:**
    - `clinic_id` (path): Clinic ID
  - **Response:**
    ```json
    {
      "clinic_id": 1,
      "count": 10,
      "patients": [...]
    }
    ```
  - **Example:** `GET /api/patients/assigned/clinic/1`

---

### **FR-14: Review AI Analysis Results and Annotations** ✅ 100%

#### **1. View AI Results**
- **GET `/api/ai-results/analysis/<analysis_id>`** ✅
  - **Mô tả:** Lấy tất cả AI results cho một analysis
  - **Parameters:**
    - `analysis_id` (path): Analysis ID
  - **Response:** List of AI results với risk_level, confidence_score, disease_type

- **GET `/api/ai-results/<result_id>`** ✅
  - **Mô tả:** Lấy AI result theo ID
  - **Parameters:**
    - `result_id` (path): Result ID

#### **2. View AI Annotations**
- **GET `/api/ai-annotations/analysis/<analysis_id>`** ✅
  - **Mô tả:** Lấy annotations (heatmaps) cho một analysis
  - **Parameters:**
    - `analysis_id` (path): Analysis ID
  - **Response:** Annotation với heatmap_url và description

---

### **FR-15: Validate or Correct AI-Generated Findings** ✅ 100%

#### **1. Create Doctor Review**
- **POST `/api/doctor-reviews`** ✅
  - **Mô tả:** Tạo review để validate/correct AI findings
  - **Body:**
    ```json
    {
      "analysis_id": 1,
      "doctor_id": 2,
      "validation_status": "approved",
      "comment": "AI diagnosis is accurate. Patient should follow up in 3 months."
    }
    ```
  - **validation_status:** `approved`, `rejected`, `needs_revision`, `pending`
  - **Response:** Created review với reviewed_at timestamp

#### **2. Approve Review**
- **PUT `/api/doctor-reviews/<review_id>/approve`** ✅
  - **Mô tả:** Approve một review
  - **Body (optional):**
    ```json
    {
      "comment": "Approved with minor notes"
    }
    ```

#### **3. Reject Review**
- **PUT `/api/doctor-reviews/<review_id>/reject`** ✅
  - **Mô tả:** Reject một review (cần comment)
  - **Body:**
    ```json
    {
      "comment": "AI diagnosis is incorrect. Actual condition is..."
    }
    ```

#### **4. Get Review by Analysis**
- **GET `/api/doctor-reviews/analysis/<analysis_id>`** ✅
  - **Mô tả:** Lấy review cho một analysis

---

### **FR-16: Add Medical Notes, Diagnoses, or Recommendations** ✅ 100%

#### **1. Create Medical Report**
- **POST `/api/medical-reports`** ✅
  - **Mô tả:** Tạo medical report với doctor notes
  - **Body:**
    ```json
    {
      "patient_id": 1,
      "analysis_id": 1,
      "doctor_id": 2,
      "report_url": "https://example.com/report.pdf"
    }
    ```
  - **Note:** Report tự động có recommendations dựa trên risk_level (FR-5)

#### **2. Add Comments to Review**
- **POST `/api/doctor-reviews`** ✅
  - **Body:**
    ```json
    {
      "analysis_id": 1,
      "doctor_id": 2,
      "validation_status": "needs_revision",
      "comment": "Patient needs immediate follow-up. Recommend specialist consultation."
    }
    ```

#### **3. Update Review Comment**
- **PUT `/api/doctor-reviews/<review_id>/comment`** ✅
  - **Body:**
    ```json
    {
      "comment": "Updated diagnosis notes..."
    }
    ```

---

### **FR-17: Access Patient History, Previous Analyses, and Trend Data** ✅ 100%

#### **1. Get Patient Analysis History** ✅ NEW
- **GET `/api/ai-analyses/patient/<patient_id>`** ✅
  - **Mô tả:** Lấy lịch sử analyses cho patient (có pagination và date filtering)
  - **Parameters:**
    - `patient_id` (path): Patient ID
    - `limit` (query, optional): Số lượng kết quả (default: 50)
    - `offset` (query, optional): Số lượng bỏ qua (default: 0)
    - `start_date` (query, optional): Ngày bắt đầu (format: YYYY-MM-DD)
    - `end_date` (query, optional): Ngày kết thúc (format: YYYY-MM-DD)
  - **Examples:**
    ```bash
    # Get all analyses
    GET /api/ai-analyses/patient/1
    
    # With pagination
    GET /api/ai-analyses/patient/1?limit=20&offset=0
    
    # With date range
    GET /api/ai-analyses/patient/1?start_date=2024-01-01&end_date=2024-12-31
    ```
  - **Response:**
    ```json
    {
      "patient_id": 1,
      "count": 5,
      "analyses": [...]
    }
    ```

#### **2. Get Patient Trend Data** ✅ NEW
- **GET `/api/ai-analyses/patient/<patient_id>/trend?days=90`** ✅
  - **Mô tả:** Lấy trend data visualization cho patient
  - **Parameters:**
    - `patient_id` (path): Patient ID
    - `days` (query, optional): Số ngày look back (default: 90)
  - **Response:**
    ```json
    {
      "patient_id": 1,
      "period_days": 90,
      "total_analyses": 5,
      "risk_distribution": {
        "high": 2,
        "medium": 2,
        "low": 1
      },
      "average_confidence": 85.5,
      "analysis_dates": ["2024-01-15", "2024-02-20", ...],
      "risk_levels": ["high", "medium", "low", ...],
      "confidence_scores": [90.5, 85.0, 80.0, ...],
      "trend": "stable"
    }
    ```
  - **Example:** `GET /api/ai-analyses/patient/1/trend?days=90`

---

### **FR-18: Filter or Search Patients by ID, Name, or Risk Level** ✅ 100%

#### **1. Search Patients (Multiple Filters)** ✅ NEW
- **GET `/api/patients/search?name=...&clinic_id=...&risk_level=...`** ✅
  - **Mô tả:** Search và filter patients với nhiều tiêu chí
  - **Query Parameters:**
    - `name` (optional): Patient name (partial match)
    - `clinic_id` (optional): Filter by clinic ID
    - `risk_level` (optional): Filter by risk level (`low`, `medium`, `high`, `critical`)
  - **Examples:**
    ```bash
    # Search by name only
    GET /api/patients/search?name=Nguyen
    
    # Search by name + clinic
    GET /api/patients/search?name=Nguyen&clinic_id=1
    
    # Filter by risk level
    GET /api/patients/search?risk_level=high
    
    # All filters
    GET /api/patients/search?name=Nguyen&clinic_id=1&risk_level=high
    ```
  - **Response:**
    ```json
    {
      "count": 5,
      "patients": [...]
    }
    ```

#### **2. Get Patient by ID**
- **GET `/api/patients/<patient_id>`** ✅
  - **Mô tả:** Lấy patient theo ID

---

### **FR-19: Provide Feedback to Improve AI Accuracy** ✅ 100%

#### **1. Get Feedback Aggregation** ✅ NEW
- **GET `/api/doctor-reviews/feedback/aggregation?doctor_id=...`** ✅
  - **Mô tả:** Lấy aggregated feedback statistics cho AI improvement
  - **Query Parameters:**
    - `doctor_id` (optional): Filter by doctor ID
  - **Examples:**
    ```bash
    # All doctors feedback
    GET /api/doctor-reviews/feedback/aggregation
    
    # Specific doctor feedback
    GET /api/doctor-reviews/feedback/aggregation?doctor_id=2
    ```
  - **Response:**
    ```json
    {
      "total_feedback_items": 100,
      "validation_status_distribution": {
        "approved": 75,
        "rejected": 10,
        "needs_revision": 10,
        "pending": 5
      },
      "estimated_ai_accuracy": 75.0,
      "needs_improvement_count": 20,
      "improvement_rate": 20.0,
      "feedback_summary": {
        "high_confidence": 75,
        "low_confidence": 10,
        "incorrect": 10
      }
    }
    ```

#### **2. Create Review (as Feedback)**
- **POST `/api/doctor-reviews`** ✅
  - Sử dụng `validation_status` và `comment` để provide feedback
  - `approved` = AI accurate
  - `rejected` = AI incorrect
  - `needs_revision` = AI needs improvement

---

### **FR-20: Communicate with Users Through Consultation Chat** ✅ 100%

#### **1. Create/Get Conversation**
- **POST `/api/conversations`** ✅
  - **Body:**
    ```json
    {
      "patient_id": 1,
      "doctor_id": 2,
      "status": "active"
    }
    ```
  - **Response:** Conversation với conversation_id

#### **2. Send Message**
- **POST `/api/messages`** ✅
  - **Body:**
    ```json
    {
      "conversation_id": 1,
      "sender_type": "doctor",
      "sender_name": "Dr. Nguyen Van B",
      "content": "Based on your test results, I recommend...",
      "message_type": "text"
    }
    ```

#### **3. Get Messages**
- **GET `/api/messages/conversation/<conversation_id>`** ✅
  - **Mô tả:** Lấy tất cả messages trong conversation

#### **4. Get Conversations**
- **GET `/api/conversations/doctor/<doctor_id>`** ✅
  - **Mô tả:** Lấy tất cả conversations của doctor

---

### **FR-21: View Performance Summaries or Analysis Statistics** ✅ 100%

#### **1. Get Doctor Performance Summary** ✅ NEW
- **GET `/api/doctors/<doctor_id>/performance`** ✅
  - **Mô tả:** Lấy performance summary cho doctor
  - **Parameters:**
    - `doctor_id` (path): Doctor ID
  - **Response:**
    ```json
    {
      "doctor_id": 2,
      "doctor_name": "Dr. Nguyen Van B",
      "specialization": "Ophthalmology",
      "total_reviews": 50,
      "approved_reviews": 40,
      "rejected_reviews": 5,
      "pending_reviews": 5,
      "needs_revision_reviews": 0,
      "approval_rate": 80.0,
      "total_reports": 30,
      "total_conversations": 25,
      "active_conversations": 10,
      "unique_patients": 20,
      "performance_score": 85.5
    }
    ```
  - **Example:** `GET /api/doctors/2/performance`

#### **2. Get Analysis Statistics**
- **GET `/api/ai-analyses/stats`** ✅
  - **Mô tả:** Lấy statistics về analyses
  - **Query Parameters:**
    - `status` (optional): Filter by status
  - **Response:**
    ```json
    {
      "total_analyses": 1000,
      "pending": 50,
      "processing": 20,
      "completed": 900,
      "failed": 30,
      "avg_processing_time": 45.5
    }
    ```

#### **3. Get Review Statistics**
- **GET `/api/doctor-reviews/stats`** ✅
  - **Mô tả:** Lấy statistics về reviews
  - **Query Parameters:**
    - `doctor_id` (optional): Filter by doctor
    - `status` (optional): Filter by status
  - **Response:**
    ```json
    {
      "total_reviews": 500,
      "pending": 20,
      "approved": 400,
      "rejected": 50,
      "needs_revision": 30
    }
    ```

---

## 🚀 Test Flow Mẫu Cho Doctor

### **Bước 1: Login**
```bash
POST /api/auth/login
Body: {
  "email": "doctor@example.com",
  "password": "password123"
}
Response: { "access_token": "..." }
```

### **Bước 2: Authorize trong Swagger UI**
- Click "Authorize" button
- Nhập: `Bearer <access_token>`

### **Bước 3: Get Assigned Patients (FR-13)**
```bash
GET /api/patients/assigned/clinic/1
```

### **Bước 4: Search Patients (FR-18)**
```bash
GET /api/patients/search?name=Nguyen&clinic_id=1&risk_level=high
```

### **Bước 5: View AI Results (FR-14)**
```bash
GET /api/ai-results/analysis/1
GET /api/ai-annotations/analysis/1
```

### **Bước 6: Create Review (FR-15, FR-16)**
```bash
POST /api/doctor-reviews
Body: {
  "analysis_id": 1,
  "doctor_id": 2,
  "validation_status": "approved",
  "comment": "AI diagnosis is accurate"
}
```

### **Bước 7: Get Patient Trend (FR-17)**
```bash
GET /api/ai-analyses/patient/1/trend?days=90
```

### **Bước 8: Get Performance Summary (FR-21)**
```bash
GET /api/doctors/2/performance
```

### **Bước 9: Get Feedback Aggregation (FR-19)**
```bash
GET /api/doctor-reviews/feedback/aggregation?doctor_id=2
```

### **Bước 10: Create Medical Report (FR-16)**
```bash
POST /api/medical-reports
Body: {
  "patient_id": 1,
  "analysis_id": 1,
  "doctor_id": 2,
  "report_url": "https://example.com/report.pdf"
}
```

---

## ✅ Tổng Kết

### **9/9 Doctor Requirements - 100% Testable**

| FR | Requirement | Endpoints | Status |
|----|-------------|-----------|--------|
| **FR-13** | Manage Assigned Patients | `GET /api/patients/assigned/clinic/<id>` | ✅ |
| **FR-14** | Review AI Results & Annotations | `GET /api/ai-results/analysis/<id>`, `GET /api/ai-annotations/analysis/<id>` | ✅ |
| **FR-15** | Validate AI Findings | `POST /api/doctor-reviews`, `PUT /api/doctor-reviews/<id>/approve` | ✅ |
| **FR-16** | Add Medical Notes | `POST /api/medical-reports`, `POST /api/doctor-reviews` | ✅ |
| **FR-17** | Patient History & Trend | `GET /api/ai-analyses/patient/<id>/trend` | ✅ |
| **FR-18** | Search & Filter Patients | `GET /api/patients/search?name=...&clinic_id=...&risk_level=...` | ✅ |
| **FR-19** | Feedback Aggregation | `GET /api/doctor-reviews/feedback/aggregation` | ✅ |
| **FR-20** | Communication Chat | `POST /api/conversations`, `POST /api/messages` | ✅ |
| **FR-21** | Performance Summaries | `GET /api/doctors/<id>/performance` | ✅ |

---

## 🎯 Endpoints Mới Được Thêm (Phase 2)

1. ✅ **GET `/api/patients/assigned/clinic/<clinic_id>`** - Assigned patients (FR-13)
2. ✅ **GET `/api/patients/search?name=...&clinic_id=...&risk_level=...`** - Search & filter (FR-18)
3. ✅ **GET `/api/ai-analyses/patient/<patient_id>/trend?days=90`** - Trend data (FR-17)
4. ✅ **GET `/api/doctors/<doctor_id>/performance`** - Performance summary (FR-21)
5. ✅ **GET `/api/doctor-reviews/feedback/aggregation?doctor_id=...`** - Feedback aggregation (FR-19)

---

## 📝 Lưu Ý Khi Test

1. **Authentication:** Hầu hết endpoints cần JWT token (trừ login/register)
2. **Data Dependencies:** Một số endpoints cần data có sẵn:
   - Patients cần có accounts với clinic_id
   - Analyses cần có images và results
   - Reviews cần có analyses
3. **Swagger UI:** Tất cả endpoints đã có Swagger docstrings với examples
4. **Error Handling:** Endpoints trả về proper HTTP status codes và error messages

---

## 🎉 Ready for Testing!

**Tất cả 9 Doctor Functional Requirements đều có thể test được trên Swagger UI!**

**URL:** `http://localhost:9999/docs`
