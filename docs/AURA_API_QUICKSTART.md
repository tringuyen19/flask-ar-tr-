# 🚀 AURA API - Quick Start Guide

## 📋 Tổng Quan

AURA (AI-Powered Retinal Disease Detection System) là hệ thống API hoàn chỉnh cho việc phát hiện bệnh võng mạc bằng AI.

---

## 🏃 Chạy Application

### 1. Khởi động server:

```bash
cd src
python app.py
```

### 2. Server sẽ chạy tại:

```
📍 API Server:    http://0.0.0.0:9999
📚 Swagger Docs:  http://localhost:9999/docs
💚 Health Check:  http://localhost:9999/health
🔗 API Info:      http://localhost:9999/api
```

---

## 📚 Truy Cập Swagger Documentation

Mở trình duyệt và truy cập:

```
http://localhost:9999/docs
```

Tại đây bạn sẽ thấy:
- ✅ 18 API Controllers
- ✅ 178+ API Endpoints
- ✅ Interactive API testing
- ✅ Request/Response schemas
- ✅ Try it out functionality

---

## 🔍 Các Endpoints Chính

### 🏠 Root & Info
- `GET /` - Thông tin hệ thống
- `GET /health` - Health check
- `GET /api` - Danh sách API endpoints

### 👤 Core Management
- `GET/POST /api/roles` - Quản lý roles
- `GET/POST /api/accounts` - Quản lý accounts
- `GET/POST /api/patient-profiles` - Quản lý bệnh nhân
- `GET/POST /api/doctor-profiles` - Quản lý bác sĩ
- `GET/POST /api/clinics` - Quản lý phòng khám

### 🏥 Medical & AI
- `POST /api/retinal-images` - Upload ảnh võng mạc
- `POST /api/ai-analyses` - Phân tích AI
- `GET /api/ai-results` - Kết quả AI
- `GET /api/medical-reports` - Báo cáo y khoa
- `POST /api/doctor-reviews` - Review từ bác sĩ

### 💬 Communication
- `GET/POST /api/notifications` - Thông báo
- `GET/POST /api/conversations` - Cuộc hội thoại
- `GET/POST /api/messages` - Tin nhắn

### 💰 Billing
- `GET /api/packages` - Gói dịch vụ
- `GET/POST /api/subscriptions` - Subscription
- `GET/POST /api/payments` - Thanh toán

---

## 🧪 Test API

### Sử dụng Swagger UI (Recommended):
1. Mở http://localhost:9999/docs
2. Chọn endpoint muốn test
3. Click **"Try it out"**
4. Nhập parameters
5. Click **"Execute"**
6. Xem response

### Sử dụng curl:

```bash
# Health check
curl http://localhost:9999/health

# Get system info
curl http://localhost:9999/

# Get all roles
curl http://localhost:9999/api/roles

# Create new role
curl -X POST http://localhost:9999/api/roles \
  -H "Content-Type: application/json" \
  -d '{"role_name": "Admin", "description": "Administrator role"}'
```

### Sử dụng Postman:
1. Import base URL: `http://localhost:9999`
2. Set headers: `Content-Type: application/json`
3. Tham khảo Swagger docs cho request body schemas

---

## 🗄️ Database

### Connection String:
```
mssql+pymssql://sa:123@127.0.0.1:1433/RetinalHealthDB
```

### Tables Created (18 tables):
- ✅ roles
- ✅ accounts
- ✅ clinics
- ✅ patient_profiles
- ✅ doctor_profiles
- ✅ retinal_images
- ✅ ai_model_versions
- ✅ ai_analysis
- ✅ ai_results
- ✅ ai_annotations
- ✅ medical_reports
- ✅ doctor_reviews
- ✅ notifications
- ✅ conversations
- ✅ messages
- ✅ service_packages
- ✅ subscriptions
- ✅ payments

---

## ⚙️ Configuration

File: `src/config.py`

```python
DATABASE_URI = 'mssql+pymssql://sa:123@127.0.0.1:1433/RetinalHealthDB'
PORT = 9999
DEBUG = True
```

Để thay đổi:
1. Tạo file `.env` trong `src/`
2. Thêm:
   ```
   DATABASE_URI=your_connection_string
   SECRET_KEY=your_secret_key
   DEBUG=False
   ```

---

## 🏗️ Clean Architecture Structure

```
src/
├── domain/              # Domain Layer (36 files)
│   └── models/          # Domain Entities + Interfaces
├── services/            # Business Logic (18 services)
├── infrastructure/      # Data Access Layer
│   ├── models/          # SQLAlchemy Models (18)
│   └── repositories/    # Repository Implementations (18)
└── api/                 # API Layer
    └── controllers/     # API Controllers (18)
```

---

## 🔧 Troubleshooting

### Lỗi: `/docs` trả về 404
**Giải pháp:** 
- Kiểm tra xem `flasgger` đã được cài: `pip install flasgger`
- Restart server

### Lỗi: Database connection failed
**Giải pháp:**
- Kiểm tra MS SQL Server đang chạy
- Kiểm tra connection string trong `config.py`
- Test connection: `docker ps` (nếu dùng Docker)

### Lỗi: Import errors
**Giải pháp:**
```bash
cd src
pip install -r requirements.txt
```

### Lỗi: Port 9999 already in use
**Giải pháp:**
- Đổi port trong `app.py`: `app.run(port=8000)`
- Hoặc kill process: `lsof -ti:9999 | xargs kill -9` (Mac/Linux)

---

## 📖 Documentation Files

- `AURA_CLEAN_ARCHITECTURE_COMPLETE.md` - Clean Architecture overview
- `AURA_MODELS_README.md` - Database models
- `AURA_REPOSITORIES_COMPLETE.md` - Repository layer
- `AURA_SERVICES_COMPLETE.md` - Business logic layer
- `AURA_CONTROLLERS_COMPLETE.md` - API controllers
- `AURA_API_QUICKSTART.md` - This file

---

## 🎯 Next Steps

1. ✅ **Explore Swagger UI** - Làm quen với tất cả endpoints
2. ✅ **Test API calls** - Thử gọi các endpoints
3. ⏭️ **Implement Authentication** - Thêm JWT tokens
4. ⏭️ **Add Validation** - Request validation với Marshmallow
5. ⏭️ **Write Tests** - Unit tests & Integration tests
6. ⏭️ **Deploy** - Containerize và deploy lên cloud

---

## 💡 Tips

- **Swagger UI** là công cụ tốt nhất để explore API
- Tất cả endpoints đều return JSON format
- Check `/health` endpoint để verify server status
- Xem logs trong terminal để debug
- Database tables được tạo tự động khi start app

---

**🎉 Chúc bạn code vui vẻ với AURA API!**

*Generated: 2026-01-08*
*Version: 1.0.0*

