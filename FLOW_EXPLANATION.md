# 📖 HƯỚNG DẪN: LUỒNG CHẠY CODE TRONG CLEAN ARCHITECTURE

## 🎯 VÍ DỤ CỤ THỂ: TẠO MỘT MEDICAL REPORT

Giả sử người dùng (bác sĩ) muốn **tạo một báo cáo y tế** cho bệnh nhân sau khi phân tích ảnh võng mạc.

---

## 📋 CÁC BƯỚC THỰC HIỆN

### **Bước 1️⃣: Người dùng gửi Request**

**URL:** `POST http://localhost:9999/api/medical-reports`

**Body (JSON):**
```json
{
  "patient_id": 5,
  "analysis_id": 10,
  "doctor_id": 3,
  "report_url": "https://storage.example.com/reports/report_123.pdf"
}
```

---

### **Bước 2️⃣: Flask App nhận request**

📁 **File: `src/app.py`** (dòng 7-88)

```python
def create_app():
    app = Flask(__name__)
    # Khởi tạo database
    init_db(app)
    # Đăng ký tất cả routes
    register_routes(app)  # ← Đây là nơi đăng ký các endpoint
    return app
```

**Giải thích:**
- Khi Flask app khởi động, nó sẽ gọi `register_routes(app)` để đăng ký tất cả các controller
- Mỗi controller quản lý một nhóm endpoint (ví dụ: `/api/medical-reports`)

---

### **Bước 3️⃣: Routes đăng ký các Controller**

📁 **File: `src/api/routes.py`** (dòng 11, 37)

```python
from api.controllers.medical_report_controller import medical_report_bp

def register_routes(app):
    # ... các blueprint khác
    app.register_blueprint(medical_report_bp)  # ← Đăng ký Medical Report controller
    # ...
```

**Giải thích:**
- `medical_report_bp` là một **Blueprint** (nhóm các route liên quan đến Medical Report)
- Flask sẽ biết rằng tất cả các request đến `/api/medical-reports/*` sẽ được xử lý bởi controller này

---

### **Bước 4️⃣: Controller nhận request và xử lý**

📁 **File: `src/api/controllers/medical_report_controller.py`** (dòng 45-106)

```python
# Khởi tạo Services (Business Logic Layer) ✅
from services.medical_report_service import MedicalReportService
from services.patient_profile_service import PatientProfileService
from services.doctor_profile_service import DoctorProfileService
from services.ai_analysis_service import AiAnalysisService

# Initialize SERVICES
report_service = MedicalReportService(report_repo)
patient_service = PatientProfileService(patient_repo)
doctor_service = DoctorProfileService(doctor_repo)
analysis_service = AiAnalysisService(analysis_repo)

@medical_report_bp.route('', methods=['POST'])
def create_report():
    """Endpoint để tạo medical report"""
    
    # STEP 1: Validate dữ liệu đầu vào
    schema = MedicalReportCreateRequestSchema()
    data = schema.load(request.get_json())  # ← Kiểm tra dữ liệu có hợp lệ không
    
    # STEP 2: Validate dependencies (Patient, Doctor, Analysis exist) via SERVICES ✅
    patient = patient_service.get_patient_by_id(data['patient_id'])
    if not patient:
        return not_found_response('Patient not found')
    
    doctor = doctor_service.get_doctor_by_id(data['doctor_id'])
    if not doctor:
        return not_found_response('Doctor not found')
    
    analysis = analysis_service.get_analysis_by_id(data['analysis_id'])
    if not analysis:
        return not_found_response('Analysis not found')
    
    # STEP 3: Call SERVICE (not Repository directly!) ✅
    report = report_service.generate_report(
        patient_id=data['patient_id'],
        analysis_id=data['analysis_id'],
        doctor_id=data['doctor_id'],
        report_url=data['report_url']
    )
    
    # STEP 4: Format and return response
    response_schema = MedicalReportResponseSchema()
    return success_response(response_schema.dump(report), 'Medical report created successfully'), 201
```

**✅ KIẾN TRÚC ĐÚNG:**

Code hiện tại đã tuân thủ **Clean Architecture** đúng cách!

**Luồng ĐÚNG:** Controller → Service → Repository → Database ✅

**Giải thích từng bước trong Controller:**

1. **Validate** dữ liệu bằng **Schema** (Marshmallow)
2. **Kiểm tra** các entity liên quan có tồn tại không (Patient, Doctor, Analysis) - **qua Service** ✅
3. **Gọi Service** để xử lý business logic và lưu dữ liệu ✅
4. **Trả về response** dạng JSON

---

### **Bước 4B️⃣: Service Layer (ĐANG ĐƯỢC SỬ DỤNG)** ✅

📁 **File: `src/services/medical_report_service.py`** (dòng 16-25)

**✅ Service Layer đã được tích hợp và sử dụng trong code!**

```python
class MedicalReportService:
    """Service Layer - Xử lý Business Logic"""
    
    def __init__(self, repository: IMedicalReportRepository):
        self.repository = repository
    
    def generate_report(self, patient_id: int, analysis_id: int, 
                       doctor_id: int, report_url: str) -> Optional[MedicalReport]:
        """Generate medical report với business logic"""
        
        # Business logic có thể thêm ở đây:
        # - Kiểm tra quyền hạn của doctor
        # - Validate business rules
        # - Gửi notification
        # - Logging
        # - Tính toán phức tạp
        
        return self.repository.add(
            patient_id=patient_id,
            analysis_id=analysis_id,
            doctor_id=doctor_id,
            report_url=report_url,
            created_at=datetime.now()  # ← Service quyết định thời gian, không phải Controller
        )
```

**Controller đang gọi Service đúng cách:**

```python
# ✅ CÁCH ĐÚNG (đang được sử dụng)
from services.medical_report_service import MedicalReportService

# Khởi tạo service
report_service = MedicalReportService(report_repo)

@medical_report_bp.route('', methods=['POST'])
def create_report():
    schema = MedicalReportCreateRequestSchema()
    data = schema.load(request.get_json())
    
    # Validate các dependencies qua Service
    patient = patient_service.get_patient_by_id(data['patient_id'])
    if not patient:
        return not_found_response('Patient not found')
    
    # Gọi SERVICE (không phải Repository trực tiếp) ✅
    report = report_service.generate_report(
        patient_id=data['patient_id'],
        analysis_id=data['analysis_id'],
        doctor_id=data['doctor_id'],
        report_url=data['report_url']
    )
    
    return success_response({...}), 201
```

**Lợi ích của Service Layer:**

1. **Tách biệt Business Logic** khỏi API Layer ✅
2. **Có thể tái sử dụng** (gọi từ API, CLI, Background Job...) ✅
3. **Dễ test** business logic độc lập ✅
4. **Controller gọn gàng hơn** - chỉ lo validate và format response ✅

---

### **Bước 5️⃣: Schema validate dữ liệu**

📁 **File: `src/api/schemas/medical_report_schema.py`** (dòng 3-8)

```python
class MedicalReportCreateRequestSchema(Schema):
    """Schema để validate dữ liệu khi tạo Medical Report"""
    patient_id = fields.Int(required=True)     # ← Bắt buộc phải có
    analysis_id = fields.Int(required=True)    # ← Bắt buộc phải có
    doctor_id = fields.Int(required=True)      # ← Bắt buộc phải có
    report_url = fields.Str(required=True)     # ← Bắt buộc phải có
```

**Giải thích:**
- Schema đảm bảo dữ liệu đầu vào đúng định dạng
- Nếu thiếu field hoặc sai kiểu dữ liệu → trả về lỗi validation

---

### **Bước 6️⃣: Repository thao tác với Database**

📁 **File: `src/infrastructure/repositories/medical_report_repository.py`** (dòng 20-34)

```python
class MedicalReportRepository:
    def add(self, patient_id, analysis_id, doctor_id, report_url, created_at):
        """Thêm một Medical Report mới vào database"""
        
        try:
            # BƯỚC 6.1: Tạo một object Model (SQLAlchemy) từ dữ liệu
            report_model = MedicalReportModel(
                patient_id=patient_id,
                analysis_id=analysis_id,
                doctor_id=doctor_id,
                report_url=report_url,
                created_at=created_at
            )
            
            # BƯỚC 6.2: Thêm vào database session
            self.session.add(report_model)
            
            # BƯỚC 6.3: Commit để lưu vào database thật sự
            self.session.commit()
            
            # BƯỚC 6.4: Refresh để lấy giá trị mới (như report_id tự động sinh)
            self.session.refresh(report_model)
            
            # BƯỚC 6.5: Convert từ Database Model → Domain Model
            return self._to_domain(report_model)
            
        except Exception as e:
            self.session.rollback()  # ← Rollback nếu có lỗi
            raise ValueError(f'Error creating medical report: {str(e)}')
```

**Giải thích:**
- Repository chịu trách nhiệm **tương tác với database**
- Nó chuyển đổi giữa **Domain Model** (business logic) và **Database Model** (SQLAlchemy)

---

### **Bước 7️⃣: Database Model (SQLAlchemy ORM)**

📁 **File: `src/infrastructure/models/medical/medical_report_model.py`** (dòng 4-16)

```python
class MedicalReportModel(Base):
    """Model định nghĩa cấu trúc bảng medical_reports trong database"""
    
    __tablename__ = 'medical_reports'  # ← Tên bảng trong database
    
    # Các cột trong bảng
    report_id = Column(BigInteger, primary_key=True, autoincrement=True)
    patient_id = Column(BigInteger, ForeignKey('patient_profiles.patient_id'))
    analysis_id = Column(BigInteger, ForeignKey('ai_analysis.analysis_id'))
    doctor_id = Column(BigInteger, ForeignKey('doctor_profiles.doctor_id'))
    report_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, nullable=False)
```

**Giải thích:**
- Đây là **Database Model** sử dụng SQLAlchemy ORM
- Nó map trực tiếp với **bảng `medical_reports`** trong database
- SQLAlchemy tự động sinh SQL queries (INSERT, SELECT, UPDATE, DELETE)

---

### **Bước 8️⃣: Domain Model (Business Logic)**

📁 **File: `src/domain/models/medical_report.py`** (dòng 3-11)

```python
class MedicalReport:
    """Domain Model - Đại diện cho một Medical Report trong business logic"""
    
    def __init__(self, report_id, patient_id, analysis_id, 
                 doctor_id, report_url, created_at):
        self.report_id = report_id
        self.patient_id = patient_id
        self.analysis_id = analysis_id
        self.doctor_id = doctor_id
        self.report_url = report_url
        self.created_at = created_at
```

**Giải thích:**
- Đây là **Domain Model** - class Python thuần túy, không phụ thuộc vào database
- Nó đại diện cho **business entity** trong hệ thống
- Tách biệt business logic khỏi database implementation

---

### **Bước 9️⃣: Repository chuyển đổi Model**

📁 **File: `src/infrastructure/repositories/medical_report_repository.py`** (dòng 14-18)

```python
def _to_domain(self, model: MedicalReportModel) -> MedicalReport:
    """Chuyển đổi từ Database Model → Domain Model"""
    
    return MedicalReport(
        report_id=model.report_id,
        patient_id=model.patient_id,
        analysis_id=model.analysis_id,
        doctor_id=model.doctor_id,
        report_url=model.report_url,
        created_at=model.created_at
    )
```

**Giải thích:**
- Repository chuyển đổi giữa 2 loại model:
  - **Database Model** (MedicalReportModel) ← SQLAlchemy, có quan hệ với database
  - **Domain Model** (MedicalReport) ← Python thuần, business logic

---

### **Bước 🔟: Response trả về cho Client**

📁 **File: `src/api/responses.py`** (dòng 5-6)

```python
def success_response(data, message="Success"):
    """Tạo response thành công với format chuẩn"""
    return jsonify({"message": message, "data": data}), 200
```

**Response cuối cùng:**
```json
{
  "message": "Medical report created successfully",
  "data": {
    "report_id": 25,
    "patient_id": 5,
    "analysis_id": 10,
    "doctor_id": 3,
    "report_url": "https://storage.example.com/reports/report_123.pdf",
    "created_at": "2026-01-10T14:30:00"
  }
}
```

---

## 🔄 TỔNG KẾT LUỒNG CHẠY

### **LUỒNG HIỆN TẠI (ĐÚNG - Có Service Layer)** ✅

```
┌─────────────────┐
│ 1. Client       │ POST /api/medical-reports
│    Request      │ Body: { patient_id, analysis_id, ... }
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Flask App    │ app.py → Nhận request
│    (app.py)     │ 
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Routes       │ routes.py → Tìm đúng controller
│    (routes.py)  │ 
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ 4. Controller                                       │
│    (medical_report_controller.py)                   │
│                                                     │
│    ┌───────────────────────────────────────────┐  │
│    │ a. Validate dữ liệu (Schema)               │  │
│    └───────────────────────────────────────────┘  │
│    ┌───────────────────────────────────────────┐  │
│    │ b. Kiểm tra dependencies                   │  │
│    └───────────────────────────────────────────┘  │
│    ┌───────────────────────────────────────────┐  │
│    │ c. Gọi SERVICE ✅ (Không phải Repository)  │  │
│    └───────────────────────────────────────────┘  │
│    ┌───────────────────────────────────────────┐  │
│    │ d. Trả về Response                         │  │
│    └───────────────────────────────────────────┘  │
└────────┬────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ 5. Schema       │ Validate: patient_id, analysis_id, ...
│    (schema.py)  │ 
└─────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ 6. SERVICE ✅                                        │
│    (medical_report_service.py)                       │
│                                                      │
│    ┌────────────────────────────────────────────┐  │
│    │ a. Xử lý Business Logic                     │  │
│    │    - Kiểm tra quyền                         │  │
│    │    - Validate business rules                │  │
│    │    - Tính toán                              │  │
│    └────────────────────────────────────────────┘  │
│    ┌────────────────────────────────────────────┐  │
│    │ b. Gọi Repository                           │  │
│    └────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ 7. Repository                                        │
│    (medical_report_repository.py)                    │
│                                                      │
│    ┌────────────────────────────────────────────┐  │
│    │ a. Tạo Database Model (SQLAlchemy)          │  │
│    └────────────────────────────────────────────┘  │
│    ┌────────────────────────────────────────────┐  │
│    │ b. session.add() → Thêm vào database        │  │
│    └────────────────────────────────────────────┘  │
│    ┌────────────────────────────────────────────┐  │
│    │ c. session.commit() → Lưu thật sự           │  │
│    └────────────────────────────────────────────┘  │
│    ┌────────────────────────────────────────────┐  │
│    │ d. Convert → Domain Model                   │  │
│    └────────────────────────────────────────────┘  │
└────────┬─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ 8. Database     │ INSERT INTO medical_reports (...)
│    Model        │ VALUES (...)
│    (ORM)        │ 
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 9. Database     │ SQL Server / PostgreSQL / MySQL
│    (MSSQL)      │ 
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 10. Domain      │ MedicalReport object (Python class)
│     Model       │ 
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 11. Response    │ JSON: { message, data }
│     (JSON)      │ Status Code: 201 Created
└─────────────────┘
```

---

## 📂 CẤU TRÚC THƯ MỤC VÀ VAI TRÒ

```
src/
├── app.py                          # ← 🚀 Điểm khởi đầu Flask app
│
├── api/                            # ← 🌐 Tầng API (giao tiếp với client)
│   ├── routes.py                   # ← Đăng ký tất cả routes
│   ├── responses.py                # ← Format response chuẩn (JSON)
│   │
│   ├── controllers/                # ← 🎮 Controllers (xử lý request)
│   │   ├── medical_report_controller.py
│   │   ├── patient_controller.py
│   │   └── ...
│   │
│   └── schemas/                    # ← ✅ Validation schemas (Marshmallow)
│       ├── medical_report_schema.py
│       └── ...
│
├── services/                       # ← 🧠 Tầng Service (Business Logic)
│   │                               # ✅ ĐANG ĐƯỢC SỬ DỤNG!
│   ├── medical_report_service.py
│   ├── patient_profile_service.py
│   └── ...
│
├── domain/                         # ← 💼 Tầng Domain (Business entities)
│   └── models/                     # ← Domain Models
│       ├── medical_report.py
│       ├── patient_profile.py
│       └── ...
│
└── infrastructure/                 # ← 🗄️ Tầng Infrastructure (database, external services)
    ├── databases/                  # ← Database connection
    │   ├── mssql.py               # ← SQLAlchemy session
    │   └── base.py
    │
    ├── models/                     # ← 🗃️ Database Models (SQLAlchemy ORM)
    │   └── medical/
    │       ├── medical_report_model.py
    │       └── ...
    │
    └── repositories/               # ← 🔄 Repositories (truy vấn database)
        ├── medical_report_repository.py
        └── ...
```

---

## 🎯 PHÂN TẦNG CLEAN ARCHITECTURE

### **1. API Layer (Tầng Giao diện / Presentation)**
- **Vai trò:** Nhận request từ client, validate dữ liệu, trả response
- **Chỉ lo:** HTTP requests/responses, routing, serialization
- **KHÔNG lo:** Business logic, database
- **Files:** `api/controllers/`, `api/schemas/`, `api/responses.py`
- **Ví dụ:** `medical_report_controller.py`

### **2. Service Layer (Tầng Business Logic)** ⭐
- **Vai trò:** Xử lý business logic, orchestrate các operations
- **Chỉ lo:** Business rules, validation phức tạp, workflow
- **KHÔNG lo:** HTTP, database implementation
- **Files:** `services/`
- **Ví dụ:** `medical_report_service.py`
- **✅ Hiện trạng:** Đang được sử dụng đúng cách trong tất cả controllers!

**Service Layer làm gì?**
- Kiểm tra quyền hạn (authorization)
- Validate business rules phức tạp
- Orchestrate nhiều repository calls
- Xử lý transactions
- Gửi notifications
- Logging business events

### **3. Domain Layer (Tầng Core Business)**
- **Vai trò:** Định nghĩa các entity, interfaces, business entities thuần túy
- **Chỉ lo:** Business entities, domain models
- **KHÔNG phụ thuộc:** Framework, database, external services
- **Files:** `domain/models/`
- **Ví dụ:** `medical_report.py` (class MedicalReport)

### **4. Infrastructure Layer (Tầng Hạ tầng)**
- **Vai trò:** Tương tác với database, external services, file system
- **Chỉ lo:** Database queries, external API calls
- **KHÔNG lo:** Business logic
- **Files:** `infrastructure/repositories/`, `infrastructure/models/`, `infrastructure/databases/`
- **Ví dụ:** `medical_report_repository.py`, `medical_report_model.py`

---

## 🔗 DEPENDENCY FLOW (Luồng phụ thuộc)

```
┌──────────────────────────────────────────────────────┐
│  API Layer (Controllers)                             │
│  ↓ phụ thuộc vào ↓                                   │
└──────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│  Service Layer (Business Logic)                      │
│  ↓ phụ thuộc vào ↓                                   │
└──────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│  Domain Layer (Entities & Interfaces)                │
│  ↑ được implement bởi ↑                              │
└──────────────────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│  Infrastructure Layer (Repositories & Database)      │
└──────────────────────────────────────────────────────┘
```

**Nguyên tắc:** Tầng trên phụ thuộc vào tầng dưới, tầng dưới KHÔNG biết tầng trên!

---

## 🔍 VÍ DỤ KHÁC: LẤY DANH SÁCH REPORTS CỦA BỆNH NHÂN

**Request:** `GET http://localhost:9999/api/medical-reports/patient/5?limit=10`

**Luồng chạy:**

1. **Flask App** nhận request
2. **Routes** tìm controller phù hợp
3. **Controller** (`medical_report_controller.py`):
   ```python
   @medical_report_bp.route('/patient/<int:patient_id>', methods=['GET'])
   def get_reports_by_patient(patient_id):
       limit = request.args.get('limit', 10, type=int)
       # Gọi Service (không phải Repository trực tiếp) ✅
       reports = report_service.get_recent_reports_by_patient(patient_id, limit)
       return success_response({...})
   ```

4. **Repository** (`medical_report_repository.py`, dòng 63-72):
   ```python
   def get_recent_by_patient(self, patient_id, limit):
       report_models = self.session.query(MedicalReportModel).filter_by(
           patient_id=patient_id
       ).order_by(MedicalReportModel.created_at.desc()).limit(limit).all()
       
       return [self._to_domain(model) for model in report_models]
   ```

5. **SQLAlchemy** sinh SQL:
   ```sql
   SELECT * FROM medical_reports 
   WHERE patient_id = 5 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```

6. **Response:**
   ```json
   {
     "message": "Success",
     "data": {
       "patient_id": 5,
       "count": 3,
       "reports": [
         { "report_id": 25, "analysis_id": 10, ... },
         { "report_id": 22, "analysis_id": 8, ... },
         { "report_id": 18, "analysis_id": 5, ... }
       ]
     }
   }
   ```

---

## 💡 ƯU ĐIỂM CỦA CLEAN ARCHITECTURE

### ✅ **Tách biệt rõ ràng**
- **API Layer:** Chỉ lo validate và format response
- **Domain Layer:** Chỉ lo business logic
- **Infrastructure Layer:** Chỉ lo database

### ✅ **Dễ bảo trì**
- Muốn đổi database từ MSSQL → PostgreSQL? → Chỉ sửa `infrastructure/`
- Muốn thêm validation? → Chỉ sửa `schemas/`
- Muốn thay đổi business rule? → Chỉ sửa `domain/`

### ✅ **Dễ test**
- Test Controller mà không cần database thật
- Test Repository mà không cần API
- Test Domain Model độc lập

### ✅ **Dễ mở rộng**
- Thêm endpoint mới? → Thêm function trong controller
- Thêm entity mới? → Tạo model, repository, controller mới
- Thêm API version mới? → Tạo blueprint mới

---

## 📝 CÁC THÀNH PHẦN QUAN TRỌNG

### **1. Controller (API Handler)**
```python
@medical_report_bp.route('', methods=['POST'])
def create_report():
    # Xử lý request, gọi repository, trả response
```

### **2. Schema (Validation)**
```python
class MedicalReportCreateRequestSchema(Schema):
    patient_id = fields.Int(required=True)
```

### **3. Repository (Database Access)**
```python
class MedicalReportRepository:
    def add(self, ...):
        # Thêm vào database
```

### **4. Domain Model (Business Entity)**
```python
class MedicalReport:
    def __init__(self, report_id, patient_id, ...):
        # Business entity
```

### **5. Database Model (ORM)**
```python
class MedicalReportModel(Base):
    __tablename__ = 'medical_reports'
    report_id = Column(BigInteger, primary_key=True)
```

---

## ✅ KIẾN TRÚC HIỆN TẠI (ĐÃ ĐÚNG)

### **Code đã được refactor đúng cách:**

Controller đang gọi **Service Layer**, tuân thủ Clean Architecture!

```python
# ✅ CÁCH ĐÚNG (đang sử dụng)
from services.medical_report_service import MedicalReportService
from services.patient_profile_service import PatientProfileService
from services.doctor_profile_service import DoctorProfileService
from services.ai_analysis_service import AiAnalysisService

# Khởi tạo services
report_service = MedicalReportService(report_repo)
patient_service = PatientProfileService(patient_repo)
doctor_service = DoctorProfileService(doctor_repo)
analysis_service = AiAnalysisService(analysis_repo)

@medical_report_bp.route('', methods=['POST'])
def create_report():
    # 1. Validate input
    schema = MedicalReportCreateRequestSchema()
    data = schema.load(request.get_json())
    
    # 2. Kiểm tra dependencies qua Service ✅
    patient = patient_service.get_patient_by_id(data['patient_id'])
    if not patient:
        return not_found_response('Patient not found')
    
    # 3. Gọi SERVICE (không phải Repository trực tiếp!) ✅
    report = report_service.generate_report(
        patient_id=data['patient_id'],
        analysis_id=data['analysis_id'],
        doctor_id=data['doctor_id'],
        report_url=data['report_url']
    )
    
    # 4. Trả về response
    return success_response({...}), 201
```

### **Lợi ích đã đạt được:**
✅ **Controller gọn gàng** - chỉ lo validate và format response  
✅ **Business logic tập trung** - tất cả ở Service  
✅ **Dễ tái sử dụng** - Service có thể gọi từ CLI, Background Job, etc.  
✅ **Dễ test** - Test Service độc lập, không cần HTTP  
✅ **Dễ mở rộng** - Thêm logic vào Service, không động Controller  
✅ **Tuân thủ Clean Architecture** - Tách biệt rõ ràng các tầng  

---

## 🎓 KẾT LUẬN

### **Luồng ĐÚNG khi người dùng gửi request:**

1. **Flask** nhận request
2. **Routes** định tuyến đến đúng **Controller**
3. **Controller** validate bằng **Schema**
4. **Controller** gọi **Service** ✅ (KHÔNG phải Repository)
5. **Service** xử lý business logic
6. **Service** gọi **Repository**
7. **Repository** tạo **Database Model** và lưu vào **Database**
8. **Database** trả về dữ liệu
9. **Repository** convert sang **Domain Model**
10. **Service** trả về cho **Controller**
11. **Controller** format thành **Response JSON**
12. **Client** nhận response

**→ Mỗi tầng có trách nhiệm riêng, dễ quản lý, dễ mở rộng!** 🚀

### **Kiến trúc hiện tại:**

| Thành phần | Vai trò | Trạng thái |
|------------|---------|------------|
| Controller | Validate + Gọi Service | ✅ Đúng |
| Service | Business Logic | ✅ Đang sử dụng |
| Repository | Database Access | ✅ Được gọi từ Service |

**→ Code đã tuân thủ Clean Architecture đúng cách!** ✅

---

## 📞 CÁC ENDPOINT KHÁC TƯƠNG TỰ

- `POST /api/patient-profiles` → Tạo bệnh nhân mới
- `GET /api/doctors` → Lấy danh sách bác sĩ
- `POST /api/retinal-images` → Upload ảnh võng mạc
- `POST /api/ai-analyses` → Phân tích AI
- `GET /api/notifications` → Lấy thông báo

**→ Tất cả đều theo cùng một pattern!** 🎯

