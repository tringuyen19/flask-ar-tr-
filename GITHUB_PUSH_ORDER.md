# 📦 THỨ TỰ PUSH CODE LÊN GITHUB - CLEAN ARCHITECTURE

## 🎯 Nguyên tắc: Push từ trong ra ngoài (Dependency Flow)

**Luồng phụ thuộc:** Domain → Infrastructure/Service → API → App

---

## 📋 THỨ TỰ PUSH CHI TIẾT

### **BƯỚC 1️⃣: Domain Layer (Core - Không phụ thuộc gì)** ⭐

**Lý do:** Tầng này là core, không phụ thuộc vào bất kỳ tầng nào khác.

**Files cần push:**
```
src/domain/
├── constants.py
├── exceptions.py
└── models/
    ├── account.py
    ├── role.py
    ├── patient_profile.py
    ├── doctor_profile.py
    ├── clinic.py
    ├── retinal_image.py
    ├── ai_analysis.py
    ├── ai_result.py
    ├── ai_annotation.py
    ├── ai_model_version.py
    ├── medical_report.py
    ├── doctor_review.py
    ├── notification.py
    ├── conversation.py
    ├── message.py
    ├── service_package.py
    ├── subscription.py
    ├── payment.py
    └── i*_repository.py (tất cả interfaces)
```

**Commit message:**
```bash
git add src/domain/
git commit -m "feat: Add Domain Layer - Core business entities and interfaces"
git push origin main
```

---

### **BƯỚC 2️⃣: Infrastructure Layer (Database & External Services)** 🗄️

**Lý do:** Phụ thuộc Domain Layer, nhưng không phụ thuộc Service/API.

**Files cần push:**
```
src/infrastructure/
├── databases/
│   ├── __init__.py
│   ├── base.py
│   └── mssql.py
├── models/ (Database Models - SQLAlchemy)
│   ├── __init__.py
│   ├── role_model.py
│   ├── account_model.py
│   ├── patient_profile_model.py
│   ├── doctor_profile_model.py
│   ├── clinic_model.py
│   ├── retinal_image_model.py
│   ├── ai_analysis_model.py
│   ├── ai_result_model.py
│   ├── ai_annotation_model.py
│   ├── ai_model_version_model.py
│   ├── medical_report_model.py
│   ├── doctor_review_model.py
│   ├── notification_model.py
│   ├── conversation_model.py
│   ├── message_model.py
│   ├── service_package_model.py
│   ├── subscription_model.py
│   └── payment_model.py
└── repositories/ (Implement Domain Interfaces)
    ├── role_repository.py
    ├── account_repository.py
    ├── patient_profile_repository.py
    ├── doctor_profile_repository.py
    ├── clinic_repository.py
    ├── retinal_image_repository.py
    ├── ai_analysis_repository.py
    ├── ai_result_repository.py
    ├── ai_annotation_repository.py
    ├── ai_model_version_repository.py
    ├── medical_report_repository.py
    ├── doctor_review_repository.py
    ├── notification_repository.py
    ├── conversation_repository.py
    ├── message_repository.py
    ├── service_package_repository.py
    ├── subscription_repository.py
    └── payment_repository.py
```

**Commit message:**
```bash
git add src/infrastructure/
git commit -m "feat: Add Infrastructure Layer - Database models and repositories"
git push origin main
```

---

### **BƯỚC 3️⃣: Service Layer (Business Logic)** 🧠

**Lý do:** Phụ thuộc Domain và Infrastructure, nhưng không phụ thuộc API.

**Files cần push:**
```
src/services/
├── account_service.py
├── role_service.py
├── patient_profile_service.py
├── doctor_profile_service.py
├── clinic_service.py
├── retinal_image_service.py
├── ai_analysis_service.py
├── ai_result_service.py
├── ai_annotation_service.py
├── ai_model_version_service.py
├── medical_report_service.py
├── doctor_review_service.py
├── notification_service.py
├── conversation_service.py
├── message_service.py
├── service_package_service.py
├── subscription_service.py
└── payment_service.py
```

**Commit message:**
```bash
git add src/services/
git commit -m "feat: Add Service Layer - Business logic layer"
git push origin main
```

---

### **BƯỚC 4️⃣: API Layer - Schemas (Validation)** ✅

**Lý do:** Schemas độc lập, chỉ phụ thuộc Marshmallow.

**Files cần push:**
```
src/api/schemas/
├── __init__.py
├── account_schema.py
├── role_schema.py
├── patient_schema.py
├── doctor_schema.py
├── clinic_schema.py
├── retinal_image_schema.py
├── ai_analysis_schema.py
├── ai_result_schema.py
├── ai_annotation_schema.py
├── ai_model_version_schema.py
├── medical_report_schema.py
├── doctor_review_schema.py
├── notification_schema.py
├── conversation_schema.py
├── message_schema.py
├── service_package_schema.py
├── subscription_schema.py
└── payment_schema.py
```

**Commit message:**
```bash
git add src/api/schemas/
git commit -m "feat: Add API Schemas - Request/Response validation schemas"
git push origin main
```

---

### **BƯỚC 5️⃣: API Layer - Responses & Middleware** 🔧

**Lý do:** Utilities cho API layer.

**Files cần push:**
```
src/api/
├── responses.py
├── middleware.py
├── requests.py
└── swagger.py
```

**Commit message:**
```bash
git add src/api/responses.py src/api/middleware.py src/api/requests.py src/api/swagger.py
git commit -m "feat: Add API utilities - Responses, middleware, and Swagger config"
git push origin main
```

---

### **BƯỚC 6️⃣: API Layer - Controllers** 🎮

**Lý do:** Phụ thuộc Service, Schemas, Responses.

**Files cần push:**
```
src/api/controllers/
├── account_controller.py
├── role_controller.py
├── patient_controller.py
├── doctor_controller.py
├── clinic_controller.py
├── retinal_image_controller.py
├── ai_analysis_controller.py
├── ai_result_controller.py
├── ai_annotation_controller.py
├── ai_model_version_controller.py
├── medical_report_controller.py
├── doctor_review_controller.py
├── notification_controller.py
├── conversation_controller.py
├── message_controller.py
├── service_package_controller.py
├── subscription_controller.py
└── payment_controller.py
```

**Commit message:**
```bash
git add src/api/controllers/
git commit -m "feat: Add API Controllers - HTTP request handlers"
git push origin main
```

---

### **BƯỚC 7️⃣: API Layer - Routes** 🛣️

**Lý do:** Đăng ký tất cả routes, phụ thuộc Controllers.

**Files cần push:**
```
src/api/routes.py
```

**Commit message:**
```bash
git add src/api/routes.py
git commit -m "feat: Add API Routes - Route registration"
git push origin main
```

---

### **BƯỚC 8️⃣: Application Layer (App Entry Point)** 🚀

**Lý do:** Phụ thuộc tất cả các tầng trên.

**Files cần push:**
```
src/
├── app.py
├── config.py
├── cors.py
├── error_handler.py
├── app_logging.py
├── dependency_container.py
└── create_app.py (nếu có)
```

**Commit message:**
```bash
git add src/app.py src/config.py src/cors.py src/error_handler.py src/app_logging.py src/dependency_container.py
git commit -m "feat: Add Application Layer - Flask app initialization and configuration"
git push origin main
```

---

### **BƯỚC 9️⃣: Configuration & Documentation** 📚

**Files cần push:**
```
├── requirements.txt
├── README.md
├── .env.example (nếu có)
├── swagger_config.json
└── docs/ (nếu có)
```

**Commit message:**
```bash
git add requirements.txt README.md swagger_config.json
git commit -m "docs: Add project configuration and documentation"
git push origin main
```

---

## 🔄 TÓM TẮT THỨ TỰ PUSH

```
1. Domain Layer          → Core entities & interfaces
2. Infrastructure Layer  → Database & repositories  
3. Service Layer         → Business logic
4. API Schemas          → Validation schemas
5. API Utilities        → Responses, middleware
6. API Controllers      → HTTP handlers
7. API Routes           → Route registration
8. Application Layer    → App initialization
9. Config & Docs        → Configuration files
```

---

## 💡 LỢI ÍCH CỦA THỨ TỰ NÀY

✅ **Dependency-safe:** Mỗi commit chỉ phụ thuộc vào các commit trước đó  
✅ **Dễ review:** Code reviewer có thể hiểu từng tầng một cách rõ ràng  
✅ **Dễ rollback:** Nếu có lỗi, có thể rollback từng tầng  
✅ **Clean history:** Git history phản ánh đúng kiến trúc  
✅ **Dễ test:** Có thể test từng tầng độc lập  

---

## 🚀 QUICK COMMANDS

Nếu muốn push nhanh theo từng tầng:

```bash
# 1. Domain
git add src/domain/ && git commit -m "feat: Domain Layer" && git push

# 2. Infrastructure  
git add src/infrastructure/ && git commit -m "feat: Infrastructure Layer" && git push

# 3. Services
git add src/services/ && git commit -m "feat: Service Layer" && git push

# 4. API Schemas
git add src/api/schemas/ && git commit -m "feat: API Schemas" && git push

# 5. API Utilities
git add src/api/responses.py src/api/middleware.py && git commit -m "feat: API Utilities" && git push

# 6. Controllers
git add src/api/controllers/ && git commit -m "feat: API Controllers" && git push

# 7. Routes
git add src/api/routes.py && git commit -m "feat: API Routes" && git push

# 8. App
git add src/app.py src/config.py && git commit -m "feat: Application Layer" && git push

# 9. Config
git add requirements.txt README.md && git commit -m "docs: Configuration" && git push
```

---

## ⚠️ LƯU Ý

1. **Luôn test sau mỗi commit** để đảm bảo không có lỗi
2. **Không push file nhạy cảm:** `.env`, `__pycache__/`, `.pyc`
3. **Tạo `.gitignore`** trước khi push:
   ```
   __pycache__/
   *.pyc
   .env
   *.db
   .venv/
   venv/
   ```
4. **Commit message rõ ràng:** Sử dụng conventional commits (feat:, fix:, docs:)

---

## 📝 CHECKLIST TRƯỚC KHI PUSH

- [ ] Đã tạo `.gitignore`
- [ ] Đã test từng tầng
- [ ] Không có lỗi syntax
- [ ] Không có file nhạy cảm
- [ ] Commit message rõ ràng
- [ ] Code đã được format đúng

---

**Chúc bạn push code thành công!** 🎉

