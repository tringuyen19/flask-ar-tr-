# Hướng dẫn tích hợp Frontend HTML + JavaScript + Bootstrap với Backend Flask

## 📋 Tổng quan

**Câu trả lời ngắn gọn:**
- ❌ **KHÔNG cần PHP** - Backend đã là Flask (Python)
- ✅ **Mọi tính năng backend sẽ hoạt động** - Frontend chỉ gọi REST API qua HTTP

---

## 🏗️ Kiến trúc

```
┌─────────────────────────────────────────┐
│     Frontend (HTML + JS + Bootstrap)    │
│     - Chạy trên trình duyệt             │
│     - Gọi API qua HTTP (fetch/axios)    │
└──────────────────┬──────────────────────┘
                   │ HTTP Requests
                   │ (GET, POST, PUT, DELETE)
                   ▼
┌─────────────────────────────────────────┐
│     Backend Flask (Python)              │
│     - REST API endpoints                │
│     - Port 9999                         │
│     - CORS đã được cấu hình             │
└─────────────────────────────────────────┘
```

**Lưu ý quan trọng:**
- Frontend và Backend là **2 ứng dụng độc lập**
- Frontend chỉ cần **gọi API** qua HTTP, không cần biết backend dùng ngôn ngữ gì
- Backend Flask đã có **CORS** cho phép frontend gọi API

---

## ✅ Tất cả tính năng backend sẽ hoạt động

### Vì sao?

1. **Backend đã có đầy đủ endpoints:**
   - ✅ Authentication: `/api/auth/login`, `/api/auth/register`
   - ✅ Patients: `/api/patient-profiles`
   - ✅ Doctors: `/api/doctor-profiles`
   - ✅ Images: `/api/retinal-images`
   - ✅ AI Analysis: `/api/ai-analyses`
   - ✅ Results: `/api/ai-results`
   - ✅ Reports: `/api/medical-reports`
   - ✅ Messages: `/api/conversations`, `/api/messages`
   - ✅ Payments: `/api/payments`
   - ✅ Và 178+ endpoints khác

2. **Frontend chỉ cần gọi API:**
   ```javascript
   // Ví dụ: Login
   fetch('http://localhost:9999/api/auth/login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       email: 'user@example.com',
       password: 'password123'
     })
   })
   .then(response => response.json())
   .then(data => {
     // Lưu token vào localStorage
     localStorage.setItem('token', data.data.access_token);
   });
   ```

3. **CORS đã được cấu hình:**
   - File `backend/src/cors.py` đã cho phép tất cả origins
   - Frontend có thể gọi API từ bất kỳ domain nào

---

## 🚫 Tại sao KHÔNG cần PHP?

### PHP là gì?
- PHP là **server-side language** (chạy trên server)
- Thường dùng để **render HTML** trên server (SSR - Server-Side Rendering)

### Tại sao không cần?
1. **Backend đã là Flask (Python):**
   - Flask đã xử lý tất cả logic server-side
   - Flask trả về **JSON** (không phải HTML)

2. **Frontend là Static Files:**
   - HTML + JavaScript + Bootstrap là **static files**
   - Có thể host trên:
     - Local file system (mở trực tiếp `index.html`)
     - Static hosting (GitHub Pages, Netlify, Vercel)
     - Web server đơn giản (nginx, Apache)
   - **KHÔNG cần server-side processing**

3. **Communication qua REST API:**
   - Frontend ↔ Backend giao tiếp qua **HTTP requests**
   - Không cần PHP để "kết nối" frontend và backend

---

## 📝 Ví dụ thực tế

### File structure:
```
project/
├── backend/
│   └── src/
│       └── app.py          # Flask API (port 9999)
│
└── frontend/
    ├── index.html          # Trang chủ
    ├── login.html          # Trang login
    ├── dashboard.html      # Dashboard
    ├── css/
    │   └── bootstrap.min.css
    ├── js/
    │   ├── api.js          # Functions gọi API
    │   └── auth.js         # Xử lý authentication
    └── assets/
```

### Ví dụ code frontend (`js/api.js`):
```javascript
// Base URL của backend
const API_BASE_URL = 'http://localhost:9999/api';

// Function gọi API generic
async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  // Thêm token nếu có
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Thêm body nếu có data
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }
    
    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Ví dụ: Login
async function login(email, password) {
  return await apiCall('/auth/login', 'POST', { email, password });
}

// Ví dụ: Get patient profile
async function getPatientProfile(patientId) {
  return await apiCall(`/patient-profiles/${patientId}`, 'GET');
}

// Ví dụ: Upload image
async function uploadImage(file, patientId) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('patient_id', patientId);
  
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/retinal-images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
}
```

### Ví dụ HTML (`login.html`):
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - AURA</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center">Đăng nhập</h3>
                        <form id="loginForm">
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/api.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const result = await login(email, password);
                
                // Lưu token
                localStorage.setItem('token', result.data.access_token);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert('Đăng nhập thất bại: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

---

## ✅ Checklist: Tất cả tính năng có thể làm được

### Authentication:
- ✅ Login/Register
- ✅ JWT token management
- ✅ Protected routes (check token trước khi vào trang)

### Patient Features:
- ✅ Upload retinal image
- ✅ View AI analysis results
- ✅ View medical reports
- ✅ View analysis history
- ✅ Chat with doctor

### Doctor Features:
- ✅ View patient list
- ✅ Review AI results
- ✅ Create medical reports
- ✅ Chat with patients

### Admin Features:
- ✅ Manage accounts
- ✅ View statistics
- ✅ Manage clinics

### Tất cả đều hoạt động vì:
- Backend đã có đầy đủ endpoints
- Frontend chỉ cần gọi API qua HTTP
- CORS đã được cấu hình

---

## 🚀 Cách chạy

### 1. Chạy Backend:
```bash
cd backend/src
python app.py
# Backend chạy trên http://localhost:9999
```

### 2. Mở Frontend:
```bash
# Option 1: Mở trực tiếp file HTML
# Double-click vào frontend/index.html

# Option 2: Dùng simple HTTP server (khuyến nghị)
cd frontend
python -m http.server 8080
# Frontend chạy trên http://localhost:8080
```

### 3. Test:
- Mở browser: `http://localhost:8080`
- Frontend sẽ gọi API tới `http://localhost:9999/api`

---

## 📚 Tài liệu tham khảo

- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Bootstrap:** https://getbootstrap.com/
- **Axios (optional):** https://axios-http.com/ (thay thế fetch nếu muốn)

---

## ⚠️ Lưu ý

1. **CORS:** Backend đã cấu hình CORS cho phép tất cả origins, nhưng nếu deploy production nên giới hạn origin cụ thể.

2. **Security:** 
   - Token lưu trong `localStorage` (có thể bị XSS)
   - Production nên dùng `httpOnly` cookies hoặc secure storage

3. **Error Handling:** 
   - Luôn check `response.ok` trước khi parse JSON
   - Handle network errors, 401 (unauthorized), 403 (forbidden)

4. **File Upload:**
   - Dùng `FormData` cho file upload
   - Không set `Content-Type` header (browser tự set với boundary)

---

## 🎯 Kết luận

**HTML + JavaScript + Bootstrap là đủ để:**
- ✅ Gọi tất cả API endpoints của backend
- ✅ Hiển thị dữ liệu từ backend
- ✅ Upload files, gửi forms
- ✅ Quản lý authentication (JWT)
- ✅ Tạo UI đẹp với Bootstrap

**KHÔNG cần:**
- ❌ PHP
- ❌ Server-side rendering
- ❌ Build tools phức tạp
- ❌ Framework nặng

**Chỉ cần:**
- ✅ HTML files
- ✅ JavaScript (fetch API)
- ✅ Bootstrap (CDN)
- ✅ Backend Flask đang chạy
