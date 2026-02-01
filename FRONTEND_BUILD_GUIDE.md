# 🚀 Hướng Dẫn Chi Tiết Xây Dựng Frontend AURA

## 📋 Tổng quan

File này hướng dẫn **chi tiết từng bước** để xây dựng frontend cho hệ thống AURA, bao gồm:
- Các trang cần tạo (Patient, Doctor, **Clinic/ClinicManager**, Admin)
- Cấu trúc file và thư mục
- Ngôn ngữ và công nghệ sử dụng
- Quy trình thực hiện từng bước

**Mục đích:** Để bạn hiểu rõ quy trình và có thể yêu cầu AI thực hiện theo từng bước cụ thể.

---

## 🎯 Các Trang Cần Xây Dựng

### **1. Authentication Pages (Trang xác thực)**
- ✅ `login.html` - Đăng nhập
- ✅ `register.html` - Đăng ký
- ✅ `forgot-password.html` - Quên mật khẩu
- ✅ `reset-password.html` - Đặt lại mật khẩu

### **2. Patient Pages (Trang bệnh nhân)**
- ✅ `patient/dashboard.html` - Dashboard bệnh nhân
- ✅ `patient/upload-image.html` - Upload ảnh võng mạc
- ✅ `patient/my-images.html` - Danh sách ảnh đã upload
- ✅ `patient/analysis-results.html` - Kết quả phân tích AI
- ✅ `patient/reports.html` - Báo cáo y tế
- ✅ `patient/messages.html` - Tin nhắn với bác sĩ
- ✅ `patient/profile.html` - Thông tin cá nhân
- ✅ `patient/settings.html` - Cài đặt

### **3. Doctor Pages (Trang bác sĩ)**
- ✅ `doctor/dashboard.html` - Dashboard bác sĩ
- ✅ `doctor/patients.html` - Danh sách bệnh nhân
- ✅ `doctor/reviews.html` - Xem và review kết quả AI
- ✅ `doctor/create-report.html` - Tạo báo cáo y tế
- ✅ `doctor/messages.html` - Tin nhắn với bệnh nhân
- ✅ `doctor/profile.html` - Thông tin cá nhân
- ✅ `doctor/settings.html` - Cài đặt

### **4. Clinic Pages (Trang phòng khám / ClinicManager)**
- ✅ `clinic/dashboard.html` - Dashboard phòng khám (tổng quan, thống kê)
- ✅ `clinic/profile.html` - Thông tin phòng khám (xem/sửa)
- ✅ `clinic/members.html` - Thành viên phòng khám (bác sĩ, bệnh nhân)
- ✅ `clinic/patients.html` - Bệnh nhân thuộc phòng khám
- ✅ `clinic/images.html` - Ảnh võng mạc đã upload tại phòng khám
- ✅ `clinic/analytics.html` - Tổng hợp rủi ro, xu hướng bất thường (FR-25, FR-29)
- ✅ `clinic/alerts.html` - Cảnh báo bệnh nhân nguy cơ cao (FR-29)
- ✅ `clinic/reports.html` - Báo cáo tầm soát, báo cáo tổng hợp (FR-25, FR-26)
- ✅ `clinic/usage.html` - Sử dụng dịch vụ, gói dịch vụ (FR-27)
- ✅ `clinic/export.html` - Xuất thống kê (FR-30)
- ✅ `clinic/subscriptions.html` - Gói đăng ký / subscription (ClinicManager)
- ✅ `clinic/settings.html` - Cài đặt

### **5. Admin Pages (Trang quản trị)**
- ✅ `admin/dashboard.html` - Dashboard admin
- ✅ `admin/accounts.html` - Quản lý tài khoản
- ✅ `admin/clinics.html` - Quản lý phòng khám (verify/reject/approve/suspend)
- ✅ `admin/ai-models.html` - Quản lý AI models
- ✅ `admin/statistics.html` - Thống kê hệ thống
- ✅ `admin/settings.html` - Cài đặt hệ thống

### **6. Shared Pages (Trang dùng chung)**
- ✅ `index.html` - Trang chủ/Landing page
- ✅ `404.html` - Trang lỗi 404
- ✅ `500.html` - Trang lỗi 500

**Tổng cộng: ~38-40 trang HTML** (gồm Patient, Doctor, **Clinic**, Admin, Auth, Shared)

---

## 📁 Cấu Trúc Thư Mục và File

### **Cấu trúc đề xuất:**

```
frontend/
├── index.html                          # Trang chủ
├── login.html                          # Đăng nhập
├── register.html                       # Đăng ký
├── forgot-password.html                # Quên mật khẩu
├── reset-password.html                 # Đặt lại mật khẩu
│
├── patient/                            # Thư mục trang bệnh nhân
│   ├── dashboard.html
│   ├── upload-image.html
│   ├── my-images.html
│   ├── analysis-results.html
│   ├── reports.html
│   ├── messages.html
│   ├── profile.html
│   └── settings.html
│
├── doctor/                             # Thư mục trang bác sĩ
│   ├── dashboard.html
│   ├── patients.html
│   ├── reviews.html
│   ├── create-report.html
│   ├── messages.html
│   ├── profile.html
│   └── settings.html
│
├── clinic/                             # Thư mục trang phòng khám (ClinicManager)
│   ├── dashboard.html
│   ├── profile.html
│   ├── members.html
│   ├── patients.html
│   ├── images.html
│   ├── analytics.html
│   ├── alerts.html
│   ├── reports.html
│   ├── usage.html
│   ├── export.html
│   ├── subscriptions.html
│   └── settings.html
│
├── admin/                              # Thư mục trang admin
│   ├── dashboard.html
│   ├── accounts.html
│   ├── clinics.html
│   ├── ai-models.html
│   ├── statistics.html
│   └── settings.html
│
├── css/                                # Thư mục CSS
│   ├── bootstrap.min.css               # Bootstrap 5 (CDN hoặc local)
│   ├── style.css                       # Custom styles chính
│   ├── components.css                  # Styles cho components
│   ├── utilities.css                  # Utility classes
│   └── responsive.css                 # Responsive styles
│
├── js/                                 # Thư mục JavaScript
│   ├── config.js                      # Cấu hình (API URL, constants)
│   ├── api.js                         # Functions gọi API
│   ├── auth.js                        # Xử lý authentication
│   ├── utils.js                       # Utility functions
│   ├── components/                    # JavaScript cho components
│   │   ├── sidebar.js
│   │   ├── header.js
│   │   ├── modal.js
│   │   └── table.js
│   └── pages/                         # JavaScript cho từng trang
│       ├── login.js
│       ├── patient-dashboard.js
│       ├── doctor-dashboard.js
│       └── ...
│
├── assets/                             # Thư mục assets
│   ├── images/                        # Hình ảnh
│   │   ├── logo.png
│   │   ├── logo-white.png
│   │   └── icons/
│   ├── fonts/                         # Font files (nếu cần)
│   └── uploads/                       # Thư mục upload (tạm thời)
│
├── design/                             # Thư mục design reference
│   ├── DESIGN_REFERENCE.md            # File tham khảo design
│   └── *.png                          # Ảnh demo
│
└── README.md                           # Hướng dẫn frontend
```

---

## 🛠️ Ngôn Ngữ và Công Nghệ

### **1. HTML5**
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- ✅ Form validation (HTML5 attributes)
- ✅ Accessibility attributes (`aria-*`, `role`)

### **2. CSS3**
- ✅ **Bootstrap 5** (CDN hoặc local) - Framework CSS chính
- ✅ **Custom CSS** - Override và extend Bootstrap
- ✅ **CSS Variables** - Để quản lý colors, spacing
- ✅ **Flexbox & Grid** - Layout
- ✅ **Media Queries** - Responsive design

### **3. JavaScript (Vanilla JS)**
- ✅ **ES6+** - Modern JavaScript
- ✅ **Fetch API** - Gọi REST API
- ✅ **Async/Await** - Xử lý bất đồng bộ
- ✅ **LocalStorage** - Lưu token, user info
- ✅ **DOM Manipulation** - Thao tác với HTML

### **4. Libraries/Frameworks (Optional)**
- ✅ **Bootstrap 5** - UI framework (CDN)
- ✅ **Bootstrap Icons** - Icon library (CDN)
- ✅ **Chart.js** (optional) - Charts cho dashboard
- ✅ **Axios** (optional) - Thay thế Fetch API nếu muốn

### **5. Không sử dụng:**
- ❌ React, Vue, Angular (không dùng framework JS)
- ❌ PHP, Python (backend đã xử lý)
- ❌ Build tools phức tạp (Webpack, Vite) - chỉ cần static files

---

## 📝 Chi Tiết Từng File

### **1. File cấu hình (`js/config.js`)**

```javascript
// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:9999/api',
    TIMEOUT: 30000
};

// App Configuration
const APP_CONFIG = {
    APP_NAME: 'AURA',
    VERSION: '1.0.0'
};

// Storage Keys
const STORAGE_KEYS = {
    TOKEN: 'aura_token',
    USER: 'aura_user',
    ROLE: 'aura_role'
};
```

### **2. File API (`js/api.js`)**

Chứa các functions để gọi API:
- `apiCall(endpoint, method, data)` - Generic API call function
- `login(email, password)` - Login
- `register(data)` - Register
- `getPatientProfile(id)` - Get patient profile
- `uploadImage(file, patientId)` - Upload retinal image
- `getAnalysisResults(patientId)` - Get AI analysis results
- ... (tất cả API endpoints)

### **3. File Authentication (`js/auth.js`)**

Chứa các functions xử lý authentication:
- `isAuthenticated()` - Check user đã login chưa
- `getToken()` - Lấy token từ localStorage
- `getUser()` - Lấy user info từ localStorage
- `getUserRole()` - Lấy role của user
- `logout()` - Logout và clear storage
- `checkAuth()` - Check và redirect nếu chưa login
- `requireRole(role)` - Check role và redirect nếu không đúng

### **4. File Utilities (`js/utils.js`)**

Chứa các utility functions:
- `formatDate(date)` - Format date
- `formatCurrency(amount)` - Format tiền tệ
- `showAlert(message, type)` - Hiển thị alert
- `showLoading()` - Hiển thị loading spinner
- `hideLoading()` - Ẩn loading spinner
- `validateEmail(email)` - Validate email
- `debounce(func, delay)` - Debounce function

### **5. File CSS chính (`css/style.css`)**

Chứa:
- CSS Variables (colors, spacing)
- Global styles
- Custom component styles
- Override Bootstrap nếu cần

---

## 🔄 Quy Trình Xây Dựng (Workflow)

### **PHASE 1: Setup & Foundation (Thiết lập nền tảng)**

#### **Bước 1.1: Tạo cấu trúc thư mục**
```
✅ Tạo các thư mục: css/, js/, assets/, patient/, doctor/, clinic/, admin/
✅ Tạo các file cấu hình cơ bản
```

#### **Bước 1.2: Setup HTML template cơ bản**
```
✅ Tạo template HTML với Bootstrap 5
✅ Include CSS và JS files
✅ Tạo header, sidebar, footer components (HTML)
```

#### **Bước 1.3: Tạo file JavaScript cơ bản**
```
✅ js/config.js - Cấu hình
✅ js/api.js - API functions (skeleton)
✅ js/auth.js - Authentication functions
✅ js/utils.js - Utility functions
```

#### **Bước 1.4: Tạo file CSS cơ bản**
```
✅ css/style.css - Custom styles
✅ CSS Variables cho colors, spacing
✅ Global styles
```

**Kết quả:** Có cấu trúc thư mục và các file cơ bản sẵn sàng.

---

### **PHASE 2: Authentication Pages (Trang xác thực)**

#### **Bước 2.1: Login Page**
```
✅ Tạo login.html với form đăng nhập
✅ Tạo js/pages/login.js
✅ Implement login function trong js/api.js
✅ Xử lý form submit, validation
✅ Lưu token vào localStorage
✅ Redirect sau khi login thành công
```

#### **Bước 2.2: Register Page**
```
✅ Tạo register.html với form đăng ký
✅ Tạo js/pages/register.js
✅ Implement register function trong js/api.js
✅ Validation form (email, password, confirm password)
✅ Xử lý submit và redirect
```

#### **Bước 2.3: Forgot Password & Reset Password**
```
✅ Tạo forgot-password.html
✅ Tạo reset-password.html
✅ Implement API calls
✅ Xử lý flow quên mật khẩu
```

**Kết quả:** Có đầy đủ trang authentication, user có thể login/register.

---

### **PHASE 3: Shared Components (Components dùng chung)**

#### **Bước 3.1: Header Component**
```
✅ Tạo header HTML (có thể là partial hoặc include)
✅ Tạo js/components/header.js
✅ Hiển thị user info, notifications
✅ Logout button
✅ Responsive (mobile menu)
```

#### **Bước 3.2: Sidebar Navigation**
```
✅ Tạo sidebar HTML
✅ Tạo js/components/sidebar.js
✅ Menu items theo role (Patient/Doctor/ClinicManager/Admin)
✅ Active state highlighting
✅ Responsive (collapse trên mobile)
```

#### **Bước 3.3: Common Components**
```
✅ Modal component (js/components/modal.js)
✅ Table component với pagination (js/components/table.js)
✅ Alert/Toast component (js/components/alert.js)
✅ Loading spinner component
```

**Kết quả:** Có các components dùng chung, có thể reuse trong các trang.

---

### **PHASE 4: Patient Pages (Trang bệnh nhân)**

#### **Bước 4.1: Patient Dashboard**
```
✅ Tạo patient/dashboard.html
✅ Tạo js/pages/patient-dashboard.js
✅ Hiển thị stats cards (Total Images, Analyses, Reports)
✅ Recent activities list
✅ Quick actions
✅ Gọi API để lấy data
```

#### **Bước 4.2: Upload Image Page**
```
✅ Tạo patient/upload-image.html
✅ Drag & drop area
✅ File input và preview
✅ Tạo js/pages/upload-image.js
✅ Implement uploadImage function trong js/api.js
✅ Progress bar khi upload
✅ Success/error handling
```

#### **Bước 4.3: My Images Page**
```
✅ Tạo patient/my-images.html
✅ Table/list hiển thị images
✅ Filter và search
✅ Pagination
✅ View image detail
```

#### **Bước 4.4: Analysis Results Page**
```
✅ Tạo patient/analysis-results.html
✅ Hiển thị kết quả AI analysis
✅ Image preview với annotations
✅ Results details
✅ Download report
```

#### **Bước 4.5: Reports Page**
```
✅ Tạo patient/reports.html
✅ List medical reports
✅ View report detail
✅ Download PDF
```

#### **Bước 4.6: Messages Page**
```
✅ Tạo patient/messages.html
✅ Chat interface với doctor
✅ Message list và conversation
✅ Send message functionality
```

#### **Bước 4.7: Profile & Settings**
```
✅ Tạo patient/profile.html
✅ Tạo patient/settings.html
✅ Edit profile form
✅ Change password
✅ Update settings
```

**Kết quả:** Hoàn thành tất cả trang cho Patient role.

---

### **PHASE 5: Doctor Pages (Trang bác sĩ)**

#### **Bước 5.1: Doctor Dashboard**
```
✅ Tạo doctor/dashboard.html
✅ Stats cards (Patients, Reviews, Reports)
✅ Pending reviews list
✅ Recent activities
```

#### **Bước 5.2: Patients List**
```
✅ Tạo doctor/patients.html
✅ Table danh sách patients
✅ Search và filter
✅ View patient detail
```

#### **Bước 5.3: Reviews Page**
```
✅ Tạo doctor/reviews.html
✅ List AI results cần review
✅ Review interface
✅ Approve/reject functionality
```

#### **Bước 5.4: Create Report**
```
✅ Tạo doctor/create-report.html
✅ Form tạo medical report
✅ Select patient và analysis
✅ Upload report file
✅ Submit report
```

#### **Bước 5.5: Messages, Profile, Settings**
```
✅ Tương tự Patient pages
✅ Adapt cho Doctor role
```

**Kết quả:** Hoàn thành tất cả trang cho Doctor role.

---

### **PHASE 6: Clinic Pages (Trang phòng khám / ClinicManager)**

#### **Bước 6.1: Clinic Dashboard**
```
✅ Tạo clinic/dashboard.html
✅ Tạo js/pages/clinic-dashboard.js
✅ Hiển thị thông tin phòng khám (clinic_id từ user)
✅ Stats: số bệnh nhân, ảnh, báo cáo, cảnh báo
✅ Gọi API: GET /api/clinics/<id>, /api/clinics/<id>/usage
```

#### **Bước 6.2: Clinic Profile & Members**
```
✅ Tạo clinic/profile.html - Xem/sửa thông tin phòng khám (PUT /api/clinics/<id>)
✅ Tạo clinic/members.html - Danh sách thành viên (GET /api/clinics/<id>/members)
✅ Chỉ ClinicManager/Admin được sửa profile
```

#### **Bước 6.3: Patients & Images**
```
✅ Tạo clinic/patients.html - Bệnh nhân thuộc phòng khám (GET /api/patient-profiles/assigned/clinic/<id>)
✅ Tạo clinic/images.html - Ảnh upload tại phòng khám (GET /api/retinal-images/clinic/<id>)
```

#### **Bước 6.4: Analytics & Alerts**
```
✅ Tạo clinic/analytics.html - Tổng hợp rủi ro, xu hướng bất thường
   - GET /api/clinics/<id>/risk-aggregation
   - GET /api/clinics/<id>/abnormal-trends
✅ Tạo clinic/alerts.html - Cảnh báo nguy cơ cao (GET /api/clinics/<id>/high-risk-alerts)
```

#### **Bước 6.5: Reports, Usage, Export**
```
✅ Tạo clinic/reports.html - Báo cáo tầm soát, tổng hợp (GET /api/clinics/<id>/reports-summary, /screening-report)
✅ Tạo clinic/usage.html - Sử dụng dịch vụ (GET /api/clinics/<id>/usage)
✅ Tạo clinic/export.html - Xuất thống kê (GET /api/clinics/<id>/export-statistics)
✅ Tạo clinic/subscriptions.html - Gói đăng ký (API subscriptions - ClinicManager)
```

#### **Bước 6.6: Clinic Settings**
```
✅ Tạo clinic/settings.html
✅ Cài đặt liên quan phòng khám (nếu có)
```

**Kết quả:** Hoàn thành tất cả trang cho Clinic (ClinicManager) role.

---

### **PHASE 7: Admin Pages (Trang quản trị)**

#### **Bước 7.1: Admin Dashboard**
```
✅ Tạo admin/dashboard.html
✅ System statistics
✅ Charts (nếu dùng Chart.js)
✅ Recent activities
```

#### **Bước 6.2: Manage Accounts**
```
✅ Tạo admin/accounts.html
✅ Table danh sách accounts
✅ Create/Edit/Delete account
✅ Change role, status
```

#### **Bước 7.3: Manage Clinics**
```
✅ Tạo admin/clinics.html
✅ List clinics
✅ Create/Edit clinic
✅ Verify clinic
```

#### **Bước 7.4: AI Models Management**
```
✅ Tạo admin/ai-models.html
✅ List AI model versions
✅ Activate/deactivate models
```

#### **Bước 6.5: Statistics & Settings**
```
✅ Tạo admin/statistics.html
✅ System statistics và reports
✅ Tạo admin/settings.html
```

**Kết quả:** Hoàn thành tất cả trang cho Admin role.

---

### **PHASE 8: Polish & Optimization (Hoàn thiện)**

#### **Bước 8.1: Error Handling**
```
✅ 404.html và 500.html
✅ Error handling trong API calls
✅ User-friendly error messages
```

#### **Bước 8.2: Responsive Design**
```
✅ Test trên mobile, tablet, desktop
✅ Fix responsive issues
✅ Optimize images
```

#### **Bước 7.3: Performance Optimization**
```
✅ Minify CSS/JS (nếu cần)
✅ Optimize images
✅ Lazy loading cho images
```

#### **Bước 8.4: Testing**
```
✅ Test tất cả flows
✅ Test authentication
✅ Test API integration
✅ Fix bugs
```

**Kết quả:** Frontend hoàn chỉnh, sẵn sàng sử dụng.

---

## 📋 Checklist Tổng Quan

### **Setup**
- [ ] Tạo cấu trúc thư mục
- [ ] Setup HTML template
- [ ] Tạo file JavaScript cơ bản
- [ ] Tạo file CSS cơ bản

### **Authentication**
- [ ] Login page
- [ ] Register page
- [ ] Forgot password page
- [ ] Reset password page

### **Components**
- [ ] Header component
- [ ] Sidebar navigation
- [ ] Modal component
- [ ] Table component
- [ ] Alert component

### **Patient Pages**
- [ ] Dashboard
- [ ] Upload image
- [ ] My images
- [ ] Analysis results
- [ ] Reports
- [ ] Messages
- [ ] Profile
- [ ] Settings

### **Doctor Pages**
- [ ] Dashboard
- [ ] Patients list
- [ ] Reviews
- [ ] Create report
- [ ] Messages
- [ ] Profile
- [ ] Settings

### **Clinic Pages (ClinicManager)**
- [ ] Dashboard
- [ ] Profile (thông tin phòng khám)
- [ ] Members
- [ ] Patients
- [ ] Images
- [ ] Analytics
- [ ] Alerts
- [ ] Reports
- [ ] Usage
- [ ] Export
- [ ] Subscriptions
- [ ] Settings

### **Admin Pages**
- [ ] Dashboard
- [ ] Manage accounts
- [ ] Manage clinics
- [ ] AI models
- [ ] Statistics
- [ ] Settings

### **Polish**
- [ ] Error pages (404, 500)
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Testing

---

## 🎯 Cách Sử Dụng Guide Này

### **Khi muốn bắt đầu xây dựng:**

1. **Bắt đầu từ PHASE 1:**
   ```
   "Bắt đầu PHASE 1: Setup & Foundation. Tạo cấu trúc thư mục và các file cơ bản."
   ```

2. **Tiếp tục từng phase:**
   ```
   "Tiếp tục PHASE 2: Authentication Pages. Tạo login.html và register.html."
   ```

3. **Yêu cầu cụ thể từng bước:**
   ```
   "Thực hiện Bước 4.2: Upload Image Page cho Patient. Tạo patient/upload-image.html với drag & drop."
   ```

### **Khi muốn làm một trang cụ thể:**

```
"Tạo trang patient/dashboard.html theo hướng dẫn trong PHASE 4, Bước 4.1. 
Bao gồm stats cards, recent activities, và tích hợp với API."
```

### **Khi muốn làm một component:**

```
"Tạo Sidebar Navigation component theo hướng dẫn trong PHASE 3, Bước 3.2. 
Menu items theo role và responsive."
```

---

## 📚 Tài Liệu Tham Khảo

- **Design Reference:** `frontend/design/DESIGN_REFERENCE.md`
- **API Integration Guide:** `FRONTEND_HTML_JS_INTEGRATION_GUIDE.md`
- **Figma to Code Guide:** `FIGMA_TO_CODE_GUIDE.md`
- **Bootstrap 5 Docs:** https://getbootstrap.com/docs/5.3/
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## ⚠️ Lưu Ý Quan Trọng

1. **API Base URL:** Mặc định là `http://localhost:9999/api` - nhớ update khi deploy
2. **Authentication:** Luôn check token trước khi vào protected pages
3. **Error Handling:** Luôn handle errors từ API calls
4. **Responsive:** Test trên nhiều kích thước màn hình
5. **Security:** Không expose sensitive data trong frontend code

---

## 🚀 Bắt Đầu Ngay

**Để bắt đầu, hãy nói:**
```
"Bắt đầu PHASE 1: Setup & Foundation. Tạo cấu trúc thư mục frontend và các file cơ bản."
```

Hoặc nếu muốn làm một phần cụ thể:
```
"Tạo login.html và register.html theo PHASE 2."
```

---

**Cập nhật:** File này sẽ được cập nhật khi có thay đổi về quy trình hoặc yêu cầu mới.
