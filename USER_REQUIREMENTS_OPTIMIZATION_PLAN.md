# 🚀 Kế Hoạch Tối Ưu Hóa Code - 12 User Functional Requirements

## 📋 Tổng Quan

Tài liệu này mô tả cách tối ưu hóa code cho **12 User Functional Requirements** theo Clean Architecture, đảm bảo mỗi requirement được implement đúng luồng và tối ưu theo từng layer.

---

## 🏗️ Clean Architecture Flow (Luồng Chuẩn)

```
┌─────────────────────────────────────────┐
│  1. API Layer (Controllers)             │
│     - Validate input (Schemas)          │
│     - Handle HTTP requests/responses    │
│     - Call Services                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Service Layer (Business Logic)      │
│     - Business rules & validation       │
│     - Orchestrate operations            │
│     - Call Repositories                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. Domain Layer (Core Entities)         │
│     - Domain Models (Pure Python)       │
│     - Repository Interfaces (ABC)       │
│     - Business invariants               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. Infrastructure Layer (Data Access) │
│     - Repository Implementations        │
│     - Database Models (SQLAlchemy)      │
│     - External Services                 │
└─────────────────────────────────────────┘
```

---

## 📝 12 USER FUNCTIONAL REQUIREMENTS - Tối Ưu Hóa Chi Tiết

### **FR-1: Register and Log In** ✅

**Entities liên quan:** `Account`, `Role`

**Luồng tối ưu:**

#### **API Layer** (`auth_controller.py`)
```python
@auth_bp.route('/register', methods=['POST'])
def register():
    # 1. Validate input với Schema
    schema = RegisterRequestSchema()
    data = schema.load(request.get_json())
    
    # 2. Gọi Service (không có business logic ở đây)
    account = account_service.register_account(...)
    
    # 3. Format response
    return success_response(...)
```

**Tối ưu hóa:**
- ✅ Đã có: Schema validation
- ✅ Đã có: Service layer
- ⚠️ Cần: Tách password hashing vào Service (không nên ở Controller)
- ⚠️ Cần: Error handling nhất quán

#### **Service Layer** (`account_service.py`)
```python
def register_account(self, email, password, role_id, clinic_id=None):
    # 1. Business validation
    if self.repository.check_email_exists(email):
        raise ValueError("Email already exists")
    
    # 2. Hash password (business logic)
    password_hash = self._hash_password(password)
    
    # 3. Call repository
    return self.repository.add(...)
```

**Tối ưu hóa:**
- ✅ Đã có: Email duplicate check
- ✅ Đã có: Password hashing
- ⚠️ Cần: Move password hashing từ Controller → Service
- ⚠️ Cần: Add transaction handling

#### **Domain Layer** (`account.py`, `iaccount_repository.py`)
```python
class Account:
    """Pure domain entity"""
    def __init__(self, account_id, email, password_hash, ...):
        self.account_id = account_id
        self.email = email
        # Business invariants
        if not email or '@' not in email:
            raise ValueError("Invalid email")
```

**Tối ưu hóa:**
- ✅ Đã có: Domain model
- ✅ Đã có: Repository interface
- ⚠️ Cần: Add domain validation (email format, password strength)

#### **Infrastructure Layer** (`account_repository.py`, `account_model.py`)
```python
class AccountRepository(IAccountRepository):
    def add(self, ...):
        # 1. Convert Domain → Database Model
        model = AccountModel(...)
        
        # 2. Save to database
        self.session.add(model)
        self.session.commit()
        
        # 3. Convert Database → Domain Model
        return self._to_domain(model)
```

**Tối ưu hóa:**
- ✅ Đã có: Repository implementation
- ✅ Đã có: Model mapping
- ⚠️ Cần: Improve error handling
- ⚠️ Cần: Add connection pooling

---

### **FR-2: Upload Single or Multiple Retinal Images** ✅

**Entities liên quan:** `RetinalImage`, `PatientProfile`, `Clinic`

**Luồng tối ưu:**

#### **API Layer** (`retinal_image_controller.py`)
```python
@retinal_image_bp.route('', methods=['POST'])
def upload_image():
    # 1. Validate input
    schema = RetinalImageCreateRequestSchema()
    data = schema.load(request.get_json())
    
    # 2. Call Service (single image)
    image = image_service.upload_image(...)
    
    # 3. Format response
    return success_response(...)

@retinal_image_bp.route('/bulk', methods=['POST'])
def upload_bulk_images():
    # 1. Validate input
    schema = RetinalImageBulkCreateRequestSchema()
    data = schema.load(request.get_json())
    
    # 2. Call Service (bulk)
    result = image_service.upload_bulk_images(...)
    
    # 3. Format response
    return success_response(...)
```

**Tối ưu hóa:**
- ✅ Đã có: Single & bulk upload
- ✅ Đã có: Schema validation
- ⚠️ Cần: Consistent error handling
- ⚠️ Cần: Add file validation (size, format)

#### **Service Layer** (`retinal_image_service.py`)
```python
def upload_image(self, patient_id, clinic_id, ...):
    # 1. Validate dependencies
    patient = self.patient_repo.get_by_id(patient_id)
    if not patient:
        raise ValueError("Patient not found")
    
    # 2. Business rules
    # Check subscription credits, etc.
    
    # 3. Call repository
    return self.repository.add(...)

def upload_bulk_images(self, images_data):
    # 1. Validate all images
    # 2. Process in batch
    # 3. Return results with errors
    uploaded = []
    errors = []
    for img_data in images_data:
        try:
            image = self.upload_image(**img_data)
            uploaded.append(image)
        except Exception as e:
            errors.append({'image_url': img_data.get('image_url'), 'error': str(e)})
    
    return {
        'uploaded': uploaded,
        'errors': errors,
        'total': len(images_data),
        'success_count': len(uploaded),
        'error_count': len(errors)
    }
```

**Tối ưu hóa:**
- ✅ Đã có: Bulk upload logic
- ⚠️ Cần: Add subscription credit check
- ⚠️ Cần: Add transaction handling cho bulk
- ⚠️ Cần: Add async processing cho large batches

---

### **FR-3: View AI-Generated Diagnostic Results** ✅

**Entities liên quan:** `AiResult`, `AiAnalysis`

**Luồng tối ưu:**

#### **API Layer** (`ai_result_controller.py`)
```python
@ai_result_bp.route('/analysis/<int:analysis_id>', methods=['GET'])
def get_results_by_analysis(analysis_id):
    # 1. Call Service
    results = result_service.get_results_by_analysis(analysis_id)
    
    # 2. Format response
    schema = AiResultResponseSchema(many=True)
    return success_response(schema.dump(results))
```

**Tối ưu hóa:**
- ✅ Đã có: Get results by analysis
- ⚠️ Cần: Add filtering by risk_level
- ⚠️ Cần: Add pagination

#### **Service Layer** (`ai_result_service.py`)
```python
def get_results_by_analysis(self, analysis_id):
    # 1. Validate analysis exists
    analysis = self.analysis_repo.get_by_id(analysis_id)
    if not analysis:
        raise ValueError("Analysis not found")
    
    # 2. Get results
    return self.repository.get_by_analysis_id(analysis_id)
```

**Tối ưu hóa:**
- ✅ Đã có: Basic retrieval
- ⚠️ Cần: Add caching for frequently accessed results
- ⚠️ Cần: Add filtering logic

---

### **FR-4: Visualize Annotated Images** ✅

**Entities liên quan:** `AiAnnotation`, `AiAnalysis`

**Luồng tối ưu:**

#### **API Layer** (`ai_annotation_controller.py`)
```python
@ai_annotation_bp.route('/analysis/<int:analysis_id>', methods=['GET'])
def get_annotations_by_analysis(analysis_id):
    # 1. Call Service
    annotations = annotation_service.get_annotations_by_analysis(analysis_id)
    
    # 2. Format response
    return success_response(...)
```

**Tối ưu hóa:**
- ✅ Đã có: Get annotations
- ⚠️ Cần: Add image URL validation
- ⚠️ Cần: Add caching for heatmap URLs

---

### **FR-5: Receive Automated Health Recommendations** ⚠️

**Entities liên quan:** `MedicalReport`, `AiResult`

**Luồng tối ưu:**

#### **Service Layer** (`medical_report_service.py` hoặc `recommendation_service.py`)
```python
class RecommendationService:
    """Service để generate automated recommendations"""
    
    def generate_recommendations(self, risk_level: str, disease_type: str) -> str:
        """Generate recommendations based on risk level"""
        recommendations_map = {
            'high': (
                "⚠️ HIGH RISK DETECTED: Immediate consultation with an ophthalmologist "
                "is strongly recommended. Please schedule an appointment as soon as possible."
            ),
            'medium': (
                "⚠️ MODERATE RISK: Regular monitoring is advised. Please schedule a "
                "follow-up appointment within 1-2 months."
            ),
            'low': (
                "✅ LOW RISK: Continue with regular eye checkups as recommended by "
                "your healthcare provider."
            )
        }
        
        return recommendations_map.get(risk_level.lower(), recommendations_map['low'])
    
    def generate_warnings(self, risk_level: str, confidence_score: float) -> List[str]:
        """Generate warnings based on risk and confidence"""
        warnings = []
        
        if risk_level.lower() == 'high' and confidence_score > 0.9:
            warnings.append("URGENT: High confidence high-risk detection")
        
        if confidence_score < 0.5:
            warnings.append("Low confidence - manual review recommended")
        
        return warnings
```

**Tối ưu hóa:**
- ⚠️ Cần: Tạo `RecommendationService` riêng
- ⚠️ Cần: Integrate vào `MedicalReportService`
- ⚠️ Cần: Add notification triggers

---

### **FR-6: Access Personal Analysis History** ✅

**Entities liên quan:** `AiAnalysis`, `RetinalImage`, `MedicalReport`

**Luồng tối ưu:**

#### **Service Layer** (`ai_analysis_service.py`)
```python
def get_patient_history(self, patient_id: int, limit: int = 50, offset: int = 0):
    """Get analysis history for a patient"""
    # 1. Get all images for patient
    images = self.image_repo.get_by_patient_id(patient_id)
    
    # 2. Get analyses for these images
    analyses = []
    for image in images:
        analysis = self.repository.get_by_image_id(image.image_id)
        if analysis:
            analyses.append(analysis)
    
    # 3. Sort by date (newest first)
    analyses.sort(key=lambda x: x.analysis_time, reverse=True)
    
    # 4. Apply pagination
    return analyses[offset:offset+limit]
```

**Tối ưu hóa:**
- ✅ Đã có: Basic history retrieval
- ⚠️ Cần: Optimize query (use JOIN instead of loop)
- ⚠️ Cần: Add filtering by date range
- ⚠️ Cần: Add sorting options

---

### **FR-7: Download or Export Diagnostic Reports** ✅

**Entities liên quan:** `MedicalReport`, `ExportService`

**Luồng tối ưu:**

#### **API Layer** (`medical_report_controller.py`)
```python
@medical_report_bp.route('/<int:report_id>/export', methods=['GET'])
def export_report(report_id):
    # 1. Get format from query params
    export_format = request.args.get('format', 'pdf')
    
    # 2. Get report
    report = report_service.get_report_by_id(report_id)
    
    # 3. Call Export Service
    if export_format == 'pdf':
        buffer = export_service.generate_pdf_report(report_data)
    else:
        buffer = export_service.generate_csv_report(report_data)
    
    # 4. Return file
    return Response(buffer.getvalue(), mimetype=...)
```

**Tối ưu hóa:**
- ✅ Đã có: PDF & CSV export
- ✅ Đã có: ExportService
- ⚠️ Cần: Add async generation for large reports
- ⚠️ Cần: Add caching for frequently exported reports

---

### **FR-8: Manage Personal Profile** ✅

**Entities liên quan:** `PatientProfile`, `Account`

**Luồng tối ưu:**

#### **Service Layer** (`patient_profile_service.py`)
```python
def update_patient(self, patient_id: int, **kwargs):
    """Update patient profile with validation"""
    # 1. Get existing patient
    patient = self.repository.get_by_id(patient_id)
    if not patient:
        raise ValueError("Patient not found")
    
    # 2. Business validation
    if 'date_of_birth' in kwargs:
        # Validate age, etc.
        pass
    
    # 3. Update
    return self.repository.update(patient_id, **kwargs)
```

**Tối ưu hóa:**
- ✅ Đã có: CRUD operations
- ⚠️ Cần: Add validation rules (age, gender, etc.)
- ⚠️ Cần: Add audit logging

---

### **FR-9: Receive Notifications** ✅

**Entities liên quan:** `Notification`

**Luồng tối ưu:**

#### **Service Layer** (`notification_service.py`)
```python
def create_notification(self, account_id: int, type: str, content: str):
    """Create notification"""
    return self.repository.add(...)

def send_ai_result_notification(self, account_id: int, analysis_id: int):
    """Auto-trigger notification when AI result is ready"""
    analysis = self.analysis_repo.get_by_id(analysis_id)
    content = f"AI analysis completed for image {analysis.image_id}"
    
    return self.create_notification(
        account_id=account_id,
        type='ai_result_ready',
        content=content
    )
```

**Tối ưu hóa:**
- ✅ Đã có: Notification system
- ⚠️ Cần: Add auto-trigger hooks
- ⚠️ Cần: Add notification templates
- ⚠️ Cần: Add batch notifications

---

### **FR-10: Communicate with Doctor** ✅

**Entities liên quan:** `Conversation`, `Message`

**Luồng tối ưu:**

#### **Service Layer** (`conversation_service.py`, `message_service.py`)
```python
def create_conversation(self, patient_id: int, doctor_id: int):
    """Create conversation between patient and doctor"""
    # 1. Validate both exist
    patient = self.patient_repo.get_by_id(patient_id)
    doctor = self.doctor_repo.get_by_id(doctor_id)
    
    # 2. Check if conversation already exists
    existing = self.repository.get_by_participants(patient_id, doctor_id)
    if existing:
        return existing
    
    # 3. Create new conversation
    return self.repository.add(...)

def send_message(self, conversation_id: int, sender_type: str, content: str):
    """Send message in conversation"""
    # 1. Validate conversation
    conversation = self.conversation_repo.get_by_id(conversation_id)
    
    # 2. Create message
    message = self.message_repo.add(...)
    
    # 3. Send notification
    self.notification_service.create_notification(...)
    
    return message
```

**Tối ưu hóa:**
- ✅ Đã có: Conversation & Message system
- ⚠️ Cần: Add message read receipts
- ⚠️ Cần: Add typing indicators
- ⚠️ Cần: Add file attachments

---

### **FR-11: Purchase Service Packages** ✅

**Entities liên quan:** `ServicePackage`, `Subscription`, `Payment`

**Luồng tối ưu:**

#### **Service Layer** (`subscription_service.py`)
```python
def purchase_package(self, account_id: int, package_id: int):
    """Purchase and activate subscription"""
    # 1. Get package
    package = self.package_repo.get_by_id(package_id)
    
    # 2. Check existing subscription
    existing = self.repository.get_active_subscription(account_id)
    if existing:
        # Extend existing subscription
        return self.extend_subscription(existing.subscription_id, package)
    
    # 3. Create new subscription
    subscription = self.repository.add(...)
    
    # 4. Create payment record
    self.payment_service.create_payment(...)
    
    # 5. Deduct credits
    self._update_credits(subscription, package.image_limit)
    
    return subscription
```

**Tối ưu hóa:**
- ✅ Đã có: Package purchase
- ⚠️ Cần: Add transaction handling
- ⚠️ Cần: Add payment gateway integration
- ⚠️ Cần: Add refund logic

---

### **FR-12: View Payment History and Credits** ✅

**Entities liên quan:** `Payment`, `Subscription`

**Luồng tối ưu:**

#### **Service Layer** (`payment_service.py`, `subscription_service.py`)
```python
def get_payment_history(self, account_id: int, limit: int = 50):
    """Get payment history for account"""
    subscriptions = self.subscription_repo.get_by_account_id(account_id)
    
    payments = []
    for sub in subscriptions:
        sub_payments = self.repository.get_by_subscription_id(sub.subscription_id)
        payments.extend(sub_payments)
    
    # Sort by date
    payments.sort(key=lambda x: x.payment_time, reverse=True)
    
    return payments[:limit]

def get_remaining_credits(self, account_id: int) -> int:
    """Get remaining analysis credits"""
    subscription = self.repository.get_active_subscription(account_id)
    if not subscription:
        return 0
    
    return subscription.remaining_credits
```

**Tối ưu hóa:**
- ✅ Đã có: Payment history
- ✅ Đã có: Remaining credits
- ⚠️ Cần: Optimize query (use JOIN)
- ⚠️ Cần: Add credit expiration handling

---

## 🔧 Các Tối Ưu Hóa Chung Cho Tất Cả Requirements

### **1. Error Handling**

**Tạo:** `src/domain/exceptions.py`
```python
class DomainException(Exception):
    """Base exception for domain layer"""
    pass

class NotFoundException(DomainException):
    """Resource not found"""
    pass

class ValidationException(DomainException):
    """Validation error"""
    pass

class BusinessRuleException(DomainException):
    """Business rule violation"""
    pass
```

**Sử dụng trong Service:**
```python
def get_patient_by_id(self, patient_id: int):
    patient = self.repository.get_by_id(patient_id)
    if not patient:
        raise NotFoundException(f"Patient {patient_id} not found")
    return patient
```

### **2. Transaction Management**

**Tạo:** `src/infrastructure/databases/transaction.py`
```python
from contextlib import contextmanager

@contextmanager
def transaction(session):
    """Context manager for database transactions"""
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
```

**Sử dụng trong Service:**
```python
def purchase_package(self, account_id: int, package_id: int):
    with transaction(self.session):
        subscription = self.repository.add(...)
        payment = self.payment_repo.add(...)
        return subscription
```

### **3. Validation Layer**

**Tạo:** `src/domain/validators.py`
```python
class PatientValidator:
    @staticmethod
    def validate_date_of_birth(dob):
        if dob and dob > datetime.now().date():
            raise ValidationException("Date of birth cannot be in the future")
    
    @staticmethod
    def validate_email(email):
        if not email or '@' not in email:
            raise ValidationException("Invalid email format")
```

### **4. Caching Layer**

**Tạo:** `src/infrastructure/cache.py`
```python
from functools import wraps
import redis

def cache_result(ttl=300):
    """Decorator to cache service method results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            result = func(*args, **kwargs)
            redis_client.setex(cache_key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

### **5. Logging**

**Tạo:** `src/infrastructure/logging.py`
```python
import logging

logger = logging.getLogger(__name__)

def log_service_call(service_name, method_name):
    """Decorator to log service method calls"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"{service_name}.{method_name} called with args={args}, kwargs={kwargs}")
            try:
                result = func(*args, **kwargs)
                logger.info(f"{service_name}.{method_name} completed successfully")
                return result
            except Exception as e:
                logger.error(f"{service_name}.{method_name} failed: {str(e)}", exc_info=True)
                raise
        return wrapper
    return decorator
```

---

## 📊 Checklist Tối Ưu Hóa

### **API Layer**
- [ ] Consistent error handling
- [ ] Input validation với Schemas
- [ ] Response formatting nhất quán
- [ ] Authentication/Authorization middleware
- [ ] Rate limiting
- [ ] Request logging

### **Service Layer**
- [ ] Business logic validation
- [ ] Transaction management
- [ ] Error handling với custom exceptions
- [ ] Logging business events
- [ ] Caching cho expensive operations
- [ ] Dependency injection

### **Domain Layer**
- [ ] Pure domain models (no framework dependencies)
- [ ] Business invariants validation
- [ ] Repository interfaces (ABC)
- [ ] Domain exceptions
- [ ] Value objects

### **Infrastructure Layer**
- [ ] Repository implementations
- [ ] Database model mapping
- [ ] Connection pooling
- [ ] Query optimization
- [ ] Migration handling
- [ ] External service integration

---

## 🎯 Kế Hoạch Thực Hiện

### **Phase 1: Refactor Core Services (1 tuần)**
1. Move password hashing từ Controller → Service
2. Add transaction management
3. Improve error handling
4. Add domain validators

### **Phase 2: Optimize Data Access (1 tuần)**
1. Optimize queries (JOINs instead of loops)
2. Add connection pooling
3. Add query caching
4. Improve repository error handling

### **Phase 3: Add Missing Features (1 tuần)**
1. Create RecommendationService
2. Add auto-notification triggers
3. Add subscription credit checks
4. Add payment gateway integration

### **Phase 4: Testing & Documentation (1 tuần)**
1. Unit tests cho Services
2. Integration tests cho API
3. Update documentation
4. Performance testing

---

## 📝 Kết Luận

Sau khi tối ưu hóa, code sẽ:
- ✅ Tuân thủ Clean Architecture
- ✅ Dễ maintain và extend
- ✅ Performance tốt hơn
- ✅ Error handling nhất quán
- ✅ Code quality cao

**Tổng thời gian:** 4 tuần
**Priority:** High
**Impact:** High (cải thiện code quality và maintainability)

