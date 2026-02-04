## FR-1 – Đăng ký & đăng nhập bằng Email, tài khoản Google cho Patient

### 1. Mục tiêu & phạm vi

- **Mục tiêu**: Cho phép bệnh nhân (và các vai trò khác) đăng ký / đăng nhập vào AURA bằng:
  - **Email + mật khẩu (native auth)** – đã được implement hoàn chỉnh.
  - **Tài khoản Google (OAuth2)** – phần này tài liệu thiết kế chi tiết, backend/frontend sẵn sàng mở rộng, nhưng chưa bật trong UI hiện tại.
- **Phạm vi**:
  - Backend: `auth_controller.py`, `AccountService`, `AccountRepository`, JWT.
  - Frontend: `login.html`, `register.html`, `js/api.js`, `js/auth.js`, `js/pages/login.js`, `js/pages/register.js`.

---

### 2. Kiến trúc tổng quan

- **Backend**: Flask + Clean Architecture.
  - **Controller**: `auth_controller.py` xử lý HTTP, validate request bằng Marshmallow Schemas.
  - **Service**: `AccountService` xử lý nghiệp vụ (kiểm tra tồn tại email, hash mật khẩu, xác thực…).
  - **Repository**: `AccountRepository` thao tác DB (bảng `accounts`).
  - **Auth**: Sử dụng `flask_jwt_extended` để tạo **JWT access token**, thêm các claim `role_id`, `email`, `clinic_id`.
- **Frontend**:
  - Giao diện đăng nhập: `login.html`.
  - Giao diện đăng ký: `register.html`.
  - Client API: `js/api.js` (hàm `login`, `register`).
  - Quản lý token & role: `js/auth.js`.

Google OAuth được thiết kế như một lớp **identity provider** bổ sung:
- Sau khi Google xác thực thành công, backend sẽ:
  - Lấy email đã verify từ Google.
  - Tìm hoặc tạo record `accounts`.
  - Trả về JWT giống như flow email/mật khẩu để frontend sử dụng thống nhất.

---

### 3. Luồng đăng ký tài khoản (Email + mật khẩu)

#### 3.1. Giao diện & hành vi frontend

File: `frontend/register.html`
- Form gồm:
  - `email` (id `regEmail`)
  - `password` (id `regPassword`)
  - `confirmPassword` (id `regConfirmPassword`)
  - `role_id` (select `regRole` – Bệnh nhân / Bác sĩ)
  - `clinic_id` (optional – `regClinic`, chỉ hiển thị cho role phù hợp)

File: `frontend/js/pages/register.js` (không trích đầy đủ ở đây):
- Validate client-side:
  - Email đúng định dạng.
  - Password tối thiểu 6 ký tự.
  - Password & Confirm password khớp.
  - Bắt buộc chọn `role_id`.
- Gửi request:

```javascript
window.AuraAPI.register({
  email: form.email,
  password: form.password,
  role_id: Number(form.role_id),      // 3 = Patient, 2 = Doctor
  clinic_id: form.clinic_id || null,  // optional
});
```

- Khi backend trả về `access_token` + thông tin account:
  - Gọi `AuraAuth.setAuthFromResponse(response)` để lưu token + user + role vào `localStorage`.
  - Gọi `AuraAuth.redirectByRole()` để chuyển hướng:
    - Patient → `patient/dashboard.html`
    - Doctor → `doctor/dashboard.html`

#### 3.2. API backend – `POST /api/auth/register`

File: `backend/src/api/controllers/auth_controller.py`
- Endpoint: `/api/auth/register`
- Schema: `RegisterRequestSchema` (email, password, role_id, clinic_id?).
- Luồng xử lý:
  1. **Validate body** bằng Marshmallow.
  2. **Kiểm tra role**:
     - Nếu `role_id` không tồn tại → 404.
     - Nếu `role_id == 4` (ClinicManager) → từ chối, yêu cầu dùng flow `clinic-register` (FR-22).
  3. Nếu có `clinic_id` → kiểm tra tồn tại trong `ClinicService`.
  4. Gọi `AccountService.create_account`:
     - Kiểm tra email đã tồn tại → ném `ConflictException` (409).
     - Hash mật khẩu (BCrypt hoặc tương đương).
     - Lưu bản ghi mới vào `accounts` với `status='active'`.
  5. Tạo **JWT**:
     - `identity = str(account.account_id)`
     - `additional_claims = {'role_id', 'email', 'clinic_id'}`
  6. Trả `201` với payload:

```json
{
  "message": "Account created successfully",
  "data": {
    "access_token": "<JWT>",
    "account_id": 123,
    "email": "user@example.com",
    "role_id": 3,
    "clinic_id": null
  }
}
```

#### 3.3. Bảo mật & logic

- Mật khẩu **không bao giờ** được lưu plain text; Service chịu trách nhiệm hash + verify.
- Role Patient chỉ cần email + password (clinic_id optional); ClinicManager buộc phải theo luồng đăng ký phòng khám.
- JWT chứa claim role để frontend tự điều hướng & hạn chế UI, nhưng **backend vẫn kiểm soát quyền** bằng `@require_role` / `@require_roles`.

---

### 4. Luồng đăng nhập (Email + mật khẩu)

#### 4.1. Giao diện & hành vi frontend

File: `frontend/login.html`
- Form: `email`, `password`, checkbox `remember`.
- JS (trong `js/pages/login.js`):
  - Validate email + password không rỗng.
  - Gọi `window.AuraAPI.login({ email, password })`.
  - Nếu thành công:
    - `AuraAuth.setAuthFromResponse(response)` → lưu token + user + role.
    - `AuraAuth.redirectByRole()` → chuyển tới dashboard phù hợp.
  - Nếu lỗi:
    - Hiển thị message từ backend trong `#loginError`.

#### 4.2. API backend – `POST /api/auth/login`

File: `auth_controller.py` (hàm `login()`):
- Validate body bằng `LoginRequestSchema`.
- Gọi `AccountService.authenticate(email, password)`:
  - Tìm account theo email.
  - Kiểm tra `status` (chỉ cho phép `active`).
  - Verify mật khẩu bằng hàm so khớp hash.
- Nếu thành công:
  - Tạo JWT y như trong `register`.
  - Trả về JSON `data` chứa token + info.
- Các lỗi được chuẩn hóa:
  - Input sai format → 400 (ValidationError).
  - Email không tồn tại / mật khẩu sai → 400/401 (tùy implement trong service).

---

### 5. Lưu & kiểm tra trạng thái đăng nhập ở frontend

File: `frontend/js/auth.js`

- **Lưu token & user**:

```javascript
function setAuth(token, user, role) {
  if (token) localStorage.setItem(KEYS.TOKEN, token);
  if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
  if (role) localStorage.setItem(KEYS.ROLE, role);
}
```

- **Đọc token khi gọi API**:
  - `js/api.js` sử dụng `getHeaders(includeAuth=true)` → tự động chèn `Authorization: Bearer <token>` nếu có token trong `localStorage`.

- **Bảo vệ trang yêu cầu login**:
  - `AuraAuth.requireLogin()` → nếu không có token → redirect về `/login.html`.
  - `AuraAuth.requireRole('Admin')` (v.v.) dùng trong các page như admin-dashboard, admin-settings…

- **Đăng xuất**:
  - `AuraAuth.clearAuth()` xóa toàn bộ token + user + role trong `localStorage`.

---

### 6. Thiết kế & mở rộng Google Login (đề xuất)

Hiện tại code chưa build UI/endpoint hoàn chỉnh cho Google OAuth, nhưng kiến trúc đề xuất như sau (phù hợp FR-1):

#### 6.1. Backend: Endpoint Google OAuth

- Thêm cấu hình:
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` trong `config.py`.
- Thêm endpoints:
  1. `GET /api/auth/google/login`
     - Redirect người dùng tới Google OAuth consent screen.
  2. `GET /api/auth/google/callback`
     - Nhận `code` từ Google.
     - Gọi Google Token Endpoint để lấy `id_token` / `access_token`.
     - Verify `id_token`, đọc `email`, `email_verified`.
     - Nếu `email_verified`:
       - Tìm `accounts` theo email:
         - Nếu tồn tại → dùng account đó.
         - Nếu chưa tồn tại → tạo account mới với:
           - `role_id = 3` (Patient mặc định).
           - `status = active`.
           - Mật khẩu random hoặc trường `password_hash` có cờ “social_only”.
       - Tạo JWT giống flow login/register.
       - Redirect về frontend `login.html?social=google&token=<jwt>`.

#### 6.2. Frontend: Nút “Đăng nhập với Google”

- Ở `login.html`, thêm nút:

```html
<button type="button" class="btn btn-outline-danger w-100 mb-2" id="btnLoginGoogle">
  <i class="bi bi-google me-1"></i> Đăng nhập với Google
</button>
```

- JS:

```javascript
document.getElementById('btnLoginGoogle').addEventListener('click', function () {
  window.location.href = window.AURA_CONFIG.API_BASE_URL + '/api/auth/google/login';
});
```

- Trên `login.js`, nếu phát hiện `token` trên query (hoặc localStorage set từ callback) thì:
  - Gọi `AuraAuth.setAuth(token, userFromDecodedJwt, roleName)` và redirect như bình thường.

---

### 7. Quy tắc & best practices

- **Không bao giờ** parse JWT ở backend để tin vào role – backend luôn dùng `@require_role` với thông tin từ JWT đã verify.
- Mật khẩu **chỉ** đi qua HTTPS (trên production); ở dev dùng HTTP nhưng giả định đường truyền an toàn.
- Đối với Google Login:
  - Luôn verify `aud` (client_id), `iss`, `exp` của `id_token`.
  - Chỉ chấp nhận `email_verified = true`.
- Token hết hạn:
  - Hiện tại project dùng **access token ngắn**, không có refresh; khi hết hạn, frontend sẽ redirect lại login khi gặp 401.

---

### 8. Tóm tắt ngắn

- FR-1 được implement **đầy đủ** cho Email + mật khẩu:
  - Đăng ký: `/register.html` → `POST /api/auth/register` → tạo account + trả JWT.
  - Đăng nhập: `/login.html` → `POST /api/auth/login` → trả JWT.
  - Frontend lưu token & role trong `localStorage`, bảo vệ trang bằng `AuraAuth.requireRole`.
- Google Login được **thiết kế sẵn** để dễ tích hợp:
  - Chỉ cần thêm endpoints Google OAuth ở backend + 1 nút ở frontend, vẫn reuse cùng cơ chế JWT & `AuraAuth`. 

