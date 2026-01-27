# 📊 PHÂN TÍCH CHI TIẾT NON-FUNCTIONAL REQUIREMENTS

## 🎯 TỔNG QUAN

**Non-Functional Requirements (Yêu cầu phi chức năng): 13%** (3/23 done, 8 partial, 4 unknown, 8 not done)

### **Breakdown (Phân tích):**
- ✅ **Data Quality (Chất lượng dữ liệu):** 100% (2/2 done)
- ⚠️ **Maintainability (Khả năng bảo trì):** 33% (1/3 done, 2/3 partial)
- ❌ **Performance (Hiệu suất):** 0% (0/3 done, 2/3 unknown, 1/3 not done)
- ❌ **Reliability (Độ tin cậy):** 0% (0/3 done, 1/3 partial, 1/3 unknown, 1/3 not done)
- ❌ **Scalability (Khả năng mở rộng):** 0% (0/2 done, 1/2 partial, 1/2 unknown)
- ❌ **Security (Bảo mật):** 0% (0/4 done, 1/4 partial, 3/4 not done)
- ❌ **Usability (Khả năng sử dụng):** 0% (0/3 done, 1/3 partial, 2/3 not done)
- ❌ **Interoperability (Khả năng tương tác):** 0% (0/3 done, 3/3 partial, 0/3 not done)

---

## 1. PERFORMANCE REQUIREMENTS (Yêu cầu về hiệu suất) (3 requirements) - 0%

### **NFR-1: AI analysis for single image: 10-20 seconds (Phân tích AI cho một hình ảnh: 10-20 giây)**
**Trạng thái:** ⚠️ **UNKNOWN (Chưa biết)**

**Hiện tại:**
- ❌ Chưa có AI engine integration (tích hợp AI engine)
- ❌ Chưa có performance testing (kiểm thử hiệu suất)

**Cần làm:**
1. **AI Engine Integration (Tích hợp AI Engine) (2-3 tuần)**
   - [ ] Tạo AI service client (khách hàng dịch vụ AI) (REST API client hoặc gRPC)
   - [ ] Implement async processing (xử lý bất đồng bộ) cho AI analysis
   - [ ] Add queue system (hệ thống hàng đợi) (Celery hoặc Redis Queue)
   - [ ] Error handling (xử lý lỗi) và retry logic (logic thử lại)
   - [ ] Timeout handling (xử lý timeout)

2. **Performance Testing (Kiểm thử hiệu suất) (1 tuần)**
   - [ ] Load testing (kiểm thử tải) với Locust hoặc JMeter
   - [ ] Measure response times (đo thời gian phản hồi)
   - [ ] Optimize slow queries (tối ưu các truy vấn chậm)
   - [ ] Document performance metrics (tài liệu hóa các chỉ số hiệu suất)

**Files cần tạo (Files to create):**
- `src/services/ai_engine_client.py` - AI service client (khách hàng dịch vụ AI)
- `src/services/ai_processing_queue.py` - Queue management (quản lý hàng đợi)
- `tests/performance/test_ai_analysis_performance.py` - Performance tests (kiểm thử hiệu suất)

**Impact (Tác động):** ⭐⭐⭐ Critical (Quan trọng) - Core functionality (Chức năng cốt lõi)

---

### **NFR-2: Support bulk processing (Hỗ trợ xử lý hàng loạt) (≥100 images per batch)**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có bulk upload (tải lên hàng loạt)
- ❌ Chưa có queue system (hệ thống hàng đợi)
- ❌ Chưa có parallel execution (thực thi song song)

**Cần làm:**
1. **Bulk Upload Endpoint (Điểm cuối tải lên hàng loạt) (2-3 ngày)**
   - [ ] `POST /api/retinal-images/bulk` - Accept multiple images (chấp nhận nhiều hình ảnh)
   - [ ] Batch tracking (theo dõi lô) (batch_id)
   - [ ] Progress tracking (theo dõi tiến trình)
   - [ ] Error handling per image (xử lý lỗi cho từng hình ảnh)

2. **Queue System (Hệ thống hàng đợi) (3-5 ngày)**
   - [ ] Install Celery hoặc Redis Queue
   - [ ] Create background tasks (tạo tác vụ nền) cho AI processing
   - [ ] Task status tracking (theo dõi trạng thái tác vụ)
   - [ ] Retry failed tasks (thử lại các tác vụ thất bại)

3. **Parallel Execution (Thực thi song song) (2-3 ngày)**
   - [ ] Process multiple images concurrently (xử lý nhiều hình ảnh đồng thời)
   - [ ] Worker pool configuration (cấu hình nhóm worker)
   - [ ] Resource management (quản lý tài nguyên)

**Files cần tạo (Files to create):**
- `src/services/bulk_upload_service.py` - Bulk upload logic (logic tải lên hàng loạt)
- `src/tasks/ai_processing_tasks.py` - Celery tasks (tác vụ Celery)
- `src/api/controllers/bulk_upload_controller.py` - Bulk upload endpoints (điểm cuối tải lên hàng loạt)
- `celery_app.py` - Celery configuration (cấu hình Celery)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - Scalability (Khả năng mở rộng)

---

### **NFR-3: Dashboard and result retrieval (Bảng điều khiển và truy xuất kết quả): <3 seconds**
**Trạng thái:** ⚠️ **UNKNOWN (Chưa biết)**

**Hiện tại:**
- ✅ Có endpoints (điểm cuối) (chưa test performance)
- ❌ Chưa có caching (bộ nhớ đệm)
- ❌ Chưa có optimization (tối ưu hóa)

**Cần làm:**
1. **Performance Testing (Kiểm thử hiệu suất) (1-2 ngày)**
   - [ ] Test dashboard endpoint response time (kiểm thử thời gian phản hồi của endpoint dashboard)
   - [ ] Test analytics endpoints (kiểm thử các endpoint phân tích)
   - [ ] Identify slow queries (xác định các truy vấn chậm)
   - [ ] Document baseline metrics (tài liệu hóa các chỉ số cơ bản)

2. **Caching (Bộ nhớ đệm) (2-3 ngày)**
   - [ ] Install Redis hoặc Flask-Caching
   - [ ] Cache dashboard data (dữ liệu dashboard) (TTL: 5-10 minutes)
   - [ ] Cache analytics data (dữ liệu phân tích) (TTL: 15-30 minutes)
   - [ ] Cache frequently accessed data (dữ liệu được truy cập thường xuyên)

3. **Query Optimization (Tối ưu hóa truy vấn) (2-3 ngày)**
   - [ ] Add database indexes (thêm chỉ mục cơ sở dữ liệu)
   - [ ] Optimize JOIN queries (tối ưu các truy vấn JOIN)
   - [ ] Use select_related/prefetch_related (sử dụng select_related/prefetch_related)
   - [ ] Pagination cho large datasets (phân trang cho tập dữ liệu lớn)

**Files cần sửa (Files to modify):**
- `src/services/admin_service.py` - Add caching (thêm bộ nhớ đệm)
- `src/config.py` - Redis configuration (cấu hình Redis)
- Database: Add indexes (Cơ sở dữ liệu: Thêm chỉ mục)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - User experience (Trải nghiệm người dùng)

---

## 2. RELIABILITY & AVAILABILITY REQUIREMENTS (Yêu cầu về độ tin cậy và khả dụng) (3 requirements) - 0%

### **NFR-4: System uptime ≥ 99% (Thời gian hoạt động của hệ thống ≥ 99%)**
**Trạng thái:** ⚠️ **UNKNOWN (Chưa biết)**

**Hiện tại:**
- ❌ Chưa có deployment (triển khai)
- ❌ Chưa có monitoring (giám sát)

**Cần làm:**
1. **Deployment Setup (Thiết lập triển khai) (3-5 ngày)**
   - [ ] Docker containerization (container hóa Docker)
   - [ ] Docker Compose setup (thiết lập Docker Compose)
   - [ ] Production server configuration (cấu hình máy chủ sản xuất)
   - [ ] Load balancer setup (thiết lập cân bằng tải) (optional)

2. **Monitoring (Giám sát) (2-3 ngày)**
   - [ ] Health check endpoints (điểm cuối kiểm tra sức khỏe)
   - [ ] Application monitoring (giám sát ứng dụng) (Sentry, New Relic, hoặc tự build)
   - [ ] Database monitoring (giám sát cơ sở dữ liệu)
   - [ ] Server monitoring (giám sát máy chủ) (CPU, memory, disk)

3. **High Availability (Tính khả dụng cao) (Optional, 1 tuần)**
   - [ ] Multiple server instances (nhiều phiên bản máy chủ)
   - [ ] Database replication (sao chép cơ sở dữ liệu)
   - [ ] Failover mechanisms (cơ chế chuyển đổi dự phòng)

**Files cần tạo (Files to create):**
- `Dockerfile`
- `docker-compose.yml`
- `DEPLOYMENT.md`
- `src/api/controllers/health_controller.py` - Health checks (kiểm tra sức khỏe)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - Production readiness (Sẵn sàng cho sản xuất)

---

### **NFR-5: AI Engine fail gracefully (AI Engine xử lý lỗi một cách nhẹ nhàng)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (50%)

**Hiện tại:**
- ✅ Có error handling (xử lý lỗi)
- ❌ Chưa có AI engine integration (tích hợp AI engine)
- ❌ Chưa test fail scenarios (kiểm thử các kịch bản lỗi)

**Cần làm:**
1. **Error Handling Enhancement (Nâng cấp xử lý lỗi) (2-3 ngày)**
   - [ ] Try-catch cho AI service calls (gọi dịch vụ AI)
   - [ ] Retry logic với exponential backoff (logic thử lại với backoff theo cấp số nhân)
   - [ ] Fallback mechanisms (cơ chế dự phòng)
   - [ ] User-friendly error messages (thông báo lỗi thân thiện với người dùng)

2. **Fail Scenarios Testing (Kiểm thử kịch bản lỗi) (1-2 ngày)**
   - [ ] Test AI service timeout (kiểm thử timeout dịch vụ AI)
   - [ ] Test AI service unavailable (kiểm thử dịch vụ AI không khả dụng)
   - [ ] Test invalid response format (kiểm thử định dạng phản hồi không hợp lệ)
   - [ ] Test network errors (kiểm thử lỗi mạng)

**Files cần sửa (Files to modify):**
- `src/services/ai_analysis_service.py` - Enhanced error handling (nâng cấp xử lý lỗi)
- `src/services/ai_engine_client.py` - Retry logic (logic thử lại)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - Reliability (Độ tin cậy)

---

### **NFR-6: Data backup automatically (Sao lưu dữ liệu tự động) (daily)**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có backup system (hệ thống sao lưu)
- ❌ Chưa có automation (tự động hóa)

**Cần làm:**
1. **Backup Script (Script sao lưu) (1-2 ngày)**
   - [ ] SQL Server backup script (script sao lưu SQL Server)
   - [ ] Export to SQL file (xuất ra file SQL)
   - [ ] Compress backup files (nén các file sao lưu)
   - [ ] Store backups (lưu trữ sao lưu) (local hoặc cloud)

2. **Automation (Tự động hóa) (1-2 ngày)**
   - [ ] Cron job hoặc Windows Task Scheduler (lập lịch tác vụ)
   - [ ] Daily backup schedule (lịch sao lưu hàng ngày)
   - [ ] Retention policy (chính sách lưu trữ) (keep last 30 days)
   - [ ] Backup verification (xác minh sao lưu)

3. **Restore Script (Script khôi phục) (1 ngày)**
   - [ ] Restore from backup (khôi phục từ sao lưu)
   - [ ] Verify restore success (xác minh khôi phục thành công)

**Files cần tạo (Files to create):**
- `scripts/backup_database.py` - Backup script (script sao lưu)
- `scripts/restore_database.py` - Restore script (script khôi phục)
- `scripts/backup_schedule.bat` hoặc `.sh` - Scheduler (lập lịch)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - Data safety (An toàn dữ liệu)

---

## 3. SCALABILITY REQUIREMENTS (Yêu cầu về khả năng mở rộng) (2 requirements) - 0%

### **NFR-7: Horizontal scaling of AI microservices (Mở rộng ngang cho AI microservices)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (40%)

**Hiện tại:**
- ✅ Clean Architecture (Kiến trúc sạch) (dễ scale)
- ❌ Chưa có microservice separation (tách biệt microservice)
- ❌ Chưa có containerization (container hóa)

**Cần làm:**
1. **Containerization (Container hóa) (2-3 ngày)**
   - [ ] Dockerfile cho Flask app
   - [ ] Docker Compose cho development (phát triển)
   - [ ] Multi-stage builds (build nhiều giai đoạn)
   - [ ] Environment variables (biến môi trường)

2. **Microservice Separation (Tách biệt Microservice) (Optional, 1-2 tuần)**
   - [ ] Separate AI service (tách dịch vụ AI)
   - [ ] API Gateway (Cổng API)
   - [ ] Service discovery (khám phá dịch vụ)
   - [ ] Inter-service communication (giao tiếp giữa các dịch vụ)

**Files cần tạo (Files to create):**
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

**Impact (Tác động):** ⭐ Normal (Bình thường) - Nice to have (Tốt để có) (có thể làm sau)

---

### **NFR-8: Support multiple clinics and thousands of users (Hỗ trợ nhiều phòng khám và hàng nghìn người dùng)**
**Trạng thái:** ⚠️ **UNKNOWN (Chưa biết)**

**Hiện tại:**
- ✅ Database design hỗ trợ (thiết kế cơ sở dữ liệu hỗ trợ)
- ❌ Chưa có load testing (kiểm thử tải)
- ❌ Chưa có optimization (tối ưu hóa)

**Cần làm:**
1. **Load Testing (Kiểm thử tải) (2-3 ngày)**
   - [ ] Setup Locust hoặc JMeter
   - [ ] Simulate 1000+ concurrent users (mô phỏng 1000+ người dùng đồng thời)
   - [ ] Test database performance (kiểm thử hiệu suất cơ sở dữ liệu)
   - [ ] Identify bottlenecks (xác định điểm nghẽn)

2. **Optimization (Tối ưu hóa) (1-2 tuần)**
   - [ ] Database query optimization (tối ưu hóa truy vấn cơ sở dữ liệu)
   - [ ] Connection pooling (nhóm kết nối)
   - [ ] Caching strategies (chiến lược bộ nhớ đệm)
   - [ ] CDN for static assets (CDN cho tài sản tĩnh) (nếu có)

**Files cần tạo (Files to create):**
- `tests/load/locustfile.py` - Load test scenarios (kịch bản kiểm thử tải)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - Scalability (Khả năng mở rộng)

---

## 4. SECURITY & PRIVACY REQUIREMENTS (Yêu cầu về bảo mật và quyền riêng tư) (4 requirements) - 0%

### **NFR-9: Encrypt data at rest and in transit (Mã hóa dữ liệu khi lưu trữ và khi truyền) (TLS 1.2+, AES-256)**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có encryption setup (thiết lập mã hóa)
- ❌ Chưa có TLS config (cấu hình TLS)

**Cần làm:**
1. **TLS/HTTPS (1-2 ngày)**
   - [ ] SSL certificate setup (thiết lập chứng chỉ SSL)
   - [ ] Configure Flask với HTTPS
   - [ ] Force HTTPS redirect (bắt buộc chuyển hướng HTTPS)
   - [ ] TLS 1.2+ configuration (cấu hình TLS 1.2+)

2. **Data Encryption (Mã hóa dữ liệu) (Optional, 2-3 ngày)**
   - [ ] Encrypt sensitive fields trong database (mã hóa các trường nhạy cảm trong cơ sở dữ liệu)
   - [ ] Use AES-256 encryption (sử dụng mã hóa AES-256)
   - [ ] Key management (quản lý khóa)
   - [ ] Decryption khi retrieve (giải mã khi truy xuất)

**Files cần sửa (Files to modify):**
- `src/app.py` - HTTPS configuration (cấu hình HTTPS)
- `src/config.py` - SSL settings (cài đặt SSL)
- `src/services/encryption_service.py` - Encryption logic (logic mã hóa) (optional)

**Impact (Tác động):** ⭐⭐⭐ Critical (Rất quan trọng) - Security (Bảo mật)

---

### **NFR-10: Comply with medical data protection (Tuân thủ bảo vệ dữ liệu y tế) (HIPAA-like)**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có compliance measures (biện pháp tuân thủ)
- ❌ Chưa có data protection policies (chính sách bảo vệ dữ liệu)

**Cần làm:**
1. **Privacy Settings (Cài đặt quyền riêng tư) (✅ Đã có trong FR-37)**
   - ✅ Data retention policies (chính sách lưu trữ dữ liệu)
   - ✅ Anonymization settings (cài đặt ẩn danh hóa)
   - ✅ Consent management (quản lý sự đồng ý)
   - ✅ GDPR compliance mode (chế độ tuân thủ GDPR)

2. **Access Control (Kiểm soát truy cập) (2-3 ngày)**
   - [ ] RBAC middleware (middleware RBAC) (đã đề cập)
   - [ ] Audit logging (ghi nhật ký kiểm toán) (✅ đã có)
   - [ ] Data access logs (nhật ký truy cập dữ liệu)
   - [ ] Patient data isolation (cô lập dữ liệu bệnh nhân)

3. **Data Protection (Bảo vệ dữ liệu) (1-2 ngày)**
   - [ ] Secure data transmission (truyền dữ liệu an toàn)
   - [ ] Secure data storage (lưu trữ dữ liệu an toàn)
   - [ ] Data breach notification procedures (quy trình thông báo vi phạm dữ liệu)
   - [ ] Privacy policy documentation (tài liệu chính sách quyền riêng tư)

**Files cần tạo (Files to create):**
- `docs/PRIVACY_POLICY.md` - Privacy policy (chính sách quyền riêng tư)
- `docs/DATA_PROTECTION.md` - Data protection measures (biện pháp bảo vệ dữ liệu)

**Impact (Tác động):** ⭐⭐⭐ Critical (Rất quan trọng) - Compliance (Tuân thủ)

---

### **NFR-11: Anonymize data before AI retraining (Ẩn danh hóa dữ liệu trước khi huấn luyện lại AI)**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có anonymization (ẩn danh hóa)
- ❌ Chưa có retraining pipeline (pipeline huấn luyện lại)

**Cần làm:**
1. **Anonymization Service (Dịch vụ ẩn danh hóa) (2-3 ngày)**
   - [ ] Remove PII (Personally Identifiable Information - Thông tin nhận dạng cá nhân)
   - [ ] Hash patient IDs (băm ID bệnh nhân)
   - [ ] Remove metadata (xóa siêu dữ liệu)
   - [ ] Generate anonymized dataset (tạo tập dữ liệu đã ẩn danh)

2. **Retraining Pipeline (Pipeline huấn luyện lại) (Optional, 1-2 tuần)**
   - [ ] Export anonymized data (xuất dữ liệu đã ẩn danh)
   - [ ] Format cho ML training (định dạng cho huấn luyện ML)
   - [ ] Integration với ML pipeline (tích hợp với pipeline ML)
   - [ ] Track anonymized datasets (theo dõi các tập dữ liệu đã ẩn danh)

**Files cần tạo (Files to create):**
- `src/services/anonymization_service.py` - Anonymization logic (logic ẩn danh hóa)
- `src/services/data_export_service.py` - Export anonymized data (xuất dữ liệu đã ẩn danh)

**Impact (Tác động):** ⭐ Normal (Bình thường) - Nice to have (Tốt để có) (có thể làm sau)

---

### **NFR-12: Role-based access control (Kiểm soát truy cập dựa trên vai trò) (RBAC)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (60%)

**Hiện tại:**
- ✅ Có roles (vai trò) (Admin, Doctor, Patient, ClinicManager)
- ⚠️ Chưa có permission middleware (middleware quyền)
- ⚠️ Chưa có protected routes (tuyến được bảo vệ)

**Cần làm:**
1. **RBAC Middleware (Middleware RBAC) (2-3 ngày)** - Đã đề cập trong Priority 1
   - [ ] `@require_role('Admin')` decorator (decorator yêu cầu vai trò)
   - [ ] `@require_roles(['Admin', 'Doctor'])` decorator (decorator yêu cầu nhiều vai trò)
   - [ ] Apply cho admin endpoints (áp dụng cho các endpoint admin)
   - [ ] Apply cho doctor/clinic endpoints (áp dụng cho các endpoint doctor/clinic)

**Impact:** ⭐⭐⭐ Critical - Security

---

## 5. USABILITY REQUIREMENTS (Yêu cầu về khả năng sử dụng) (3 requirements) - 0%

### **NFR-13: Web UI responsive (Giao diện web đáp ứng) (desktop, tablet, mobile)**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có frontend (giao diện người dùng)
- ✅ Có REST API (có thể dùng cho frontend)

**Cần làm:**
1. **Frontend Development (Phát triển giao diện) (2-4 tuần)**
   - [ ] React/Vue/Angular frontend
   - [ ] Responsive design (thiết kế đáp ứng)
   - [ ] Mobile-first approach (phương pháp ưu tiên mobile)
   - [ ] API integration (tích hợp API)

**Impact:** ⭐ Normal - Nice to have (có thể làm sau)

---

### **NFR-14: Upload images and view results (Tải lên hình ảnh và xem kết quả): ≤3 clicks**
**Trạng thái:** ❌ **NOT DONE (Chưa làm)** (0%)

**Hiện tại:**
- ❌ Chưa có UI (giao diện người dùng)
- ✅ API design đơn giản (có thể implement)

**Cần làm:**
- [ ] Frontend UI với simple workflow (quy trình làm việc đơn giản)
- [ ] Drag-and-drop upload (tải lên kéo và thả)
- [ ] Quick results view (xem kết quả nhanh)

**Impact:** ⭐ Normal - Nice to have (có thể làm sau)

---

### **NFR-15: Annotated images clear and clinically interpretable (Hình ảnh được chú thích rõ ràng và có thể giải thích lâm sàng)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (50%)

**Hiện tại:**
- ✅ Có heatmap_url và description (mô tả)
- ❌ Chưa có visualization tools (công cụ trực quan hóa)
- ❌ Chưa có clinical interpretation guides (hướng dẫn giải thích lâm sàng)

**Cần làm:**
1. **Visualization Enhancement (Nâng cấp trực quan hóa) (Optional, 1 tuần)**
   - [ ] Image viewer với annotations overlay (trình xem hình ảnh với lớp phủ chú thích)
   - [ ] Zoom và pan functionality (chức năng phóng to và di chuyển)
   - [ ] Annotation highlighting (làm nổi bật chú thích)
   - [ ] Clinical interpretation tooltips (tooltip giải thích lâm sàng)

**Impact:** ⭐ Normal - Nice to have (có thể làm sau)

---

## 6. MAINTAINABILITY REQUIREMENTS (Yêu cầu về khả năng bảo trì) (3 requirements) - 33%

### **NFR-16: Update AI models without downtime (Cập nhật mô hình AI mà không có thời gian chết)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (50%)

**Hiện tại:**
- ✅ Có AI model version management (quản lý phiên bản mô hình AI)
- ❌ Chưa có hot-swap mechanism (cơ chế thay thế nóng)

**Cần làm:**
1. **Hot-Swap Mechanism (Cơ chế thay thế nóng) (2-3 ngày)**
   - [ ] Support multiple model versions simultaneously (hỗ trợ nhiều phiên bản mô hình đồng thời)
   - [ ] Gradual migration (di chuyển dần dần) (A/B testing)
   - [ ] Rollback capability (khả năng hoàn nguyên)
   - [ ] Zero-downtime deployment (triển khai không có thời gian chết)

**Files cần sửa:**
- `src/services/ai_analysis_service.py` - Support multiple versions (hỗ trợ nhiều phiên bản)
- `src/services/admin_service.py` - Model switching logic (logic chuyển đổi mô hình)

**Impact:** ⭐⭐ Important - Production readiness (Sẵn sàng cho sản xuất)

---

### **NFR-17: Modular architecture (Kiến trúc mô-đun) (AI Core, Web App, Admin, DB)**
**Trạng thái:** ✅ **DONE (Hoàn thành)** (90%)

**Hiện tại:**
- ✅ Clean Architecture (Kiến trúc sạch)
- ✅ Separation of concerns (Tách biệt mối quan tâm)
- ⚠️ Chưa có AI Core microservice riêng

**Cần làm:**
- [ ] Separate AI Core service (Tách dịch vụ AI Core) (Optional)

**Impact:** ⭐ Normal - Nice to have

---

### **NFR-18: Centralized logging, auditing, error tracking (Ghi log tập trung, kiểm toán, theo dõi lỗi)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (40%)

**Hiện tại:**
- ✅ Có logging setup (thiết lập ghi log) (chưa integrate)
- ✅ Có audit logs system (hệ thống nhật ký kiểm toán) (FR-37)
- ❌ Chưa có centralized system (hệ thống tập trung)
- ❌ Chưa có error tracking (theo dõi lỗi)

**Cần làm:**
1. **Centralized Logging (Ghi log tập trung) (2-3 ngày)**
   - [ ] Integrate logging vào tất cả services (tích hợp ghi log vào tất cả dịch vụ)
   - [ ] Structured logging (ghi log có cấu trúc) (JSON format)
   - [ ] Log aggregation (tổng hợp log) (ELK stack hoặc simple file)
   - [ ] Log levels configuration (cấu hình mức log)

2. **Error Tracking (Theo dõi lỗi) (1-2 ngày)**
   - [ ] Integrate Sentry hoặc tự build
   - [ ] Track exceptions (theo dõi ngoại lệ)
   - [ ] Alert on critical errors (cảnh báo khi có lỗi nghiêm trọng)
   - [ ] Error dashboard (bảng điều khiển lỗi)

**Files cần sửa (Files to modify):**
- `src/app.py` - Logging configuration (cấu hình ghi log)
- `src/services/*.py` - Add logging (thêm ghi log)
- `src/config.py` - Logging settings (cài đặt ghi log)

**Impact (Tác động):** ⭐⭐ Important (Quan trọng) - Debugging & monitoring (Gỡ lỗi & giám sát)

---

## 7. INTEROPERABILITY REQUIREMENTS (Yêu cầu về khả năng tương tác) (3 requirements) - 0%

### **NFR-19: Support integration with retinal fundus cameras (Hỗ trợ tích hợp với camera đáy mắt)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (50%)

**Hiện tại:**
- ✅ Có image upload API (API tải lên hình ảnh)
- ❌ Chưa có camera-specific integration (tích hợp dành riêng cho camera)
- ❌ Chưa có cloud upload workflow (quy trình tải lên đám mây)

**Cần làm:**
1. **Camera Integration (Tích hợp Camera) (Optional, 1-2 tuần)**
   - [ ] Camera-specific API endpoints (điểm cuối API dành riêng cho camera)
   - [ ] Direct upload from camera (tải lên trực tiếp từ camera)
   - [ ] Metadata extraction (trích xuất siêu dữ liệu)
   - [ ] Cloud storage integration (tích hợp lưu trữ đám mây)

**Impact:** ⭐ Normal - Nice to have (có thể làm sau)

---

### **NFR-20: Export formats (Định dạng xuất): PDF, CSV, medical formats**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (70%)

**Hiện tại:**
- ✅ Có PDF export (xuất PDF) (ExportService.generate_pdf_report)
- ✅ Có CSV export (xuất CSV) (ExportService.generate_csv_report)
- ✅ Có export endpoint (điểm cuối xuất): GET /api/medical-reports/{id}/export?format=pdf|csv
- ❌ Chưa có DICOM format (định dạng DICOM) (medical format)
- ❌ Chưa có export cho other entities (xuất cho các thực thể khác) (analytics, reports, etc.)

**Cần làm:**
1. **DICOM Format (Định dạng DICOM) (Optional, 2-3 ngày)**
   - [ ] Install pydicom library
   - [ ] DICOM export functionality (chức năng xuất DICOM)
   - [ ] DICOM metadata mapping (ánh xạ siêu dữ liệu DICOM)

2. **Extended Export (Xuất mở rộng) (1-2 ngày)**
   - [ ] Export analytics data (xuất dữ liệu phân tích)
   - [ ] Export clinic reports (xuất báo cáo phòng khám)
   - [ ] Bulk export (xuất hàng loạt)

**Files cần sửa (Files to modify):**
- `src/services/export_service.py` - Add DICOM export (thêm xuất DICOM) (optional)
- `src/api/controllers/admin_controller.py` - Add analytics export (thêm xuất phân tích)

**Impact (Tác động):** ⭐ Normal (Bình thường) - Nice to have (Tốt để có) (PDF/CSV đã đủ cho Phase 4)

---

### **NFR-21: AI engine RESTful API (API RESTful của AI engine)**
**Trạng thái:** ⚠️ **PARTIAL (Một phần)** (60%)

**Hiện tại:**
- ✅ Có RESTful API structure (cấu trúc API RESTful)
- ❌ Chưa có AI engine integration (tích hợp AI engine)
- ✅ Có endpoints sẵn sàng (điểm cuối sẵn sàng)

**Cần làm:**
- [ ] AI engine integration (tích hợp AI engine) (đã đề cập trong NFR-1)

**Impact:** ⭐⭐⭐ Critical - Core functionality (Chức năng cốt lõi)

---

## 📋 TỔNG KẾT VÀ ƯU TIÊN (Summary and Priorities)

### **CRITICAL (Quan trọng - Làm ngay):**
1. **NFR-12: RBAC Middleware (Middleware RBAC)** (2-3 ngày) - Security (Bảo mật)
2. **NFR-9: TLS/HTTPS** (1-2 ngày) - Security (Bảo mật)
3. **NFR-10: HIPAA Compliance (Tuân thủ HIPAA)** (2-3 ngày) - Compliance (Tuân thủ)
4. **NFR-1: AI Engine Integration (Tích hợp AI Engine)** (2-3 tuần) - Core functionality (Chức năng cốt lõi)

### **IMPORTANT (Quan trọng - Làm sớm):**
5. **NFR-3: Dashboard Performance (Hiệu suất Dashboard)** (1 tuần) - User experience (Trải nghiệm người dùng)
6. **NFR-6: Data Backup (Sao lưu dữ liệu)** (2-3 ngày) - Data safety (An toàn dữ liệu)
7. **NFR-18: Centralized Logging (Ghi log tập trung)** (2-3 ngày) - Debugging (Gỡ lỗi)
8. **NFR-20: Export Formats (Định dạng xuất)** (1-2 ngày) - Extend existing (Mở rộng hiện có) (DICOM optional)
9. **NFR-2: Bulk Processing (Xử lý hàng loạt)** (1-2 tuần) - Scalability (Khả năng mở rộng)

### **NICE TO HAVE (Tốt để có - Có thể làm sau):**
10. **NFR-7: Microservices (Microservices)** - Optional (Tùy chọn)
11. **NFR-11: Data Anonymization (Ẩn danh hóa dữ liệu)** - Optional (Tùy chọn)
12. **NFR-13, NFR-14: Frontend UI (Giao diện người dùng)** - Optional (Tùy chọn)
13. **NFR-19: Camera Integration (Tích hợp Camera)** - Optional (Tùy chọn)

---

## 🎯 KẾ HOẠCH IMPLEMENTATION (Kế hoạch triển khai)

### **Tuần 1-2: Security & Critical (Bảo mật & Quan trọng)**
- [ ] NFR-12: RBAC Middleware (Middleware RBAC)
- [ ] NFR-9: TLS/HTTPS
- [ ] NFR-10: HIPAA Compliance (Tuân thủ HIPAA) (privacy settings đã có)
- [ ] Password hashing (Băm mật khẩu)

### **Tuần 3-4: Performance & Reliability (Hiệu suất & Độ tin cậy)**
- [ ] NFR-3: Dashboard caching & optimization (Bộ nhớ đệm và tối ưu hóa Dashboard)
- [ ] NFR-6: Data backup (Sao lưu dữ liệu)
- [ ] NFR-18: Centralized logging (Ghi log tập trung)
- [ ] NFR-20: Export formats (Định dạng xuất)

### **Tuần 5-6: Core Functionality (Chức năng cốt lõi)**
- [ ] NFR-1: AI Engine Integration (Tích hợp AI Engine)
- [ ] NFR-2: Bulk Processing (Xử lý hàng loạt)
- [ ] NFR-5: Error handling enhancement (Nâng cấp xử lý lỗi)

### **Tuần 7+: Optional (Tùy chọn)**
- [ ] NFR-7: Microservices (Microservices)
- [ ] NFR-11: Data Anonymization (Ẩn danh hóa dữ liệu)
- [ ] NFR-13, NFR-14: Frontend UI (Giao diện người dùng)

---

## 📊 MỤC TIÊU (Goals)

### **Sau 6 tuần:**
- **Security (Bảo mật):** 0% → 70-80%
- **Performance (Hiệu suất):** 0% → 40-50%
- **Reliability (Độ tin cậy):** 0% → 50-60%
- **Maintainability (Khả năng bảo trì):** 33% → 60-70%
- **Overall NFR (Tổng thể NFR):** 13% → 50-60%

### **Overall Project Completion (Hoàn thành tổng thể dự án):**
- **Functional (Chức năng):** 97% → 100%
- **Non-Functional (Phi chức năng):** 13% → 50-60%
- **Total (Tổng cộng):** ~80-85% → ~85-90%
