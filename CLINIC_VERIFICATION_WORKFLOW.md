# 🏥 Clinic Verification Workflow - FR-22

## 📋 Tổng Quan

**FR-22**: Register clinic accounts and verify organization identity

Workflow này mô tả quy trình xác thực danh tính tổ chức (clinic) từ khi đăng ký đến khi được xác minh hoặc từ chối.

---

## 🔄 Verification Workflow

### **Workflow States (Trạng thái)**

```
┌─────────┐
│ pending │  ← Clinic mới đăng ký (default status)
└────┬────┘
     │
     ├─────────────────┬─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│ verified │    │ rejected │    │ (future) │
└──────────┘    └──────────┘    │under_review│
                                └──────────┘
```

### **Status Values**

| Status | Mô tả | Có thể chuyển sang |
|--------|-------|-------------------|
| **pending** | Clinic mới đăng ký, chờ xác minh | `verified`, `rejected` |
| **verified** | Clinic đã được xác minh thành công | Không thể thay đổi (final state) |
| **rejected** | Clinic bị từ chối xác minh | Không thể thay đổi (final state) |

---

## 📝 Workflow Steps

### **Step 1: Clinic Registration**

**Endpoint:** `POST /api/clinics`

**Request:**
```json
{
  "clinic_name": "City Eye Clinic",
  "address": "123 Main Street, City",
  "phone_number": "+1234567890",
  "logo_url": "https://example.com/logo.png",
  "description": "Leading eye care clinic"
}
```

**Response:**
```json
{
  "message": "Clinic registered successfully. Pending verification.",
  "data": {
    "clinic_id": 1,
    "clinic_name": "City Eye Clinic",
    "verification_status": "pending",
    "created_at": "2024-01-15T10:00:00"
  }
}
```

**Status sau khi đăng ký:** `pending`

---

### **Step 2: Admin Reviews Pending Clinics**

**Endpoint:** `GET /api/clinics/pending`

**Response:**
```json
{
  "count": 5,
  "clinics": [
    {
      "clinic_id": 1,
      "clinic_name": "City Eye Clinic",
      "address": "123 Main Street",
      "phone_number": "+1234567890",
      "description": "Leading eye care clinic"
    }
  ]
}
```

---

### **Step 3A: Admin Verifies Clinic**

**Endpoint:** `PUT /api/clinics/{clinic_id}/verify`

**Request (optional):**
```json
{
  "admin_notes": "All documents verified. License valid."
}
```

**Response:**
```json
{
  "message": "Clinic verified successfully",
  "data": {
    "clinic_id": 1,
    "clinic_name": "City Eye Clinic",
    "verification_status": "verified"
  }
}
```

**Workflow:** `pending` → `verified`

**Validation:**
- ✅ Chỉ có thể verify clinic có status = `pending`
- ❌ Không thể verify clinic đã `verified` hoặc `rejected`

---

### **Step 3B: Admin Rejects Clinic**

**Endpoint:** `PUT /api/clinics/{clinic_id}/reject`

**Request (recommended):**
```json
{
  "rejection_reason": "Invalid license number or missing required documents"
}
```

**Response:**
```json
{
  "message": "Clinic verification rejected",
  "data": {
    "clinic_id": 1,
    "clinic_name": "City Eye Clinic",
    "verification_status": "rejected"
  }
}
```

**Workflow:** `pending` → `rejected`

**Validation:**
- ✅ Chỉ có thể reject clinic có status = `pending`
- ❌ Không thể reject clinic đã `verified` hoặc `rejected`
- ⚠️ Rejection reason được khuyến nghị (không bắt buộc)

---

### **Step 4: Check Verification Status**

**Endpoint:** `GET /api/clinics/{clinic_id}/verification-status`

**Response:**
```json
{
  "message": "Success",
  "data": {
    "clinic_id": 1,
    "verification_status": "verified"
  }
}
```

---

## 🔐 Business Rules

### **1. Registration Rules**
- ✅ Clinic mới đăng ký luôn có status = `pending`
- ✅ Không thể tự set status = `verified` khi đăng ký
- ✅ Admin phải verify/reject manually

### **2. Verification Rules**
- ✅ Chỉ Admin có quyền verify/reject
- ✅ Chỉ clinic có status = `pending` mới có thể verify/reject
- ✅ Sau khi verify/reject, status không thể thay đổi (final state)
- ✅ Verified clinic có thể sử dụng đầy đủ tính năng
- ✅ Rejected clinic không thể sử dụng tính năng

### **3. Status Transition Rules**

| From Status | To Status | Allowed? | Method |
|-------------|-----------|----------|--------|
| `pending` | `verified` | ✅ Yes | `verify_clinic()` |
| `pending` | `rejected` | ✅ Yes | `reject_clinic()` |
| `verified` | `pending` | ❌ No | Not allowed |
| `verified` | `rejected` | ❌ No | Not allowed |
| `rejected` | `pending` | ❌ No | Not allowed |
| `rejected` | `verified` | ❌ No | Not allowed |

---

## 📊 Endpoints Summary

| Endpoint | Method | Mô tả | Role Required |
|----------|--------|-------|---------------|
| `POST /api/clinics` | POST | Đăng ký clinic mới | Public |
| `GET /api/clinics/pending` | GET | Lấy danh sách clinics đang pending | Admin |
| `GET /api/clinics/{id}/verification-status` | GET | Lấy verification status | Public |
| `PUT /api/clinics/{id}/verify` | PUT | Verify clinic | Admin |
| `PUT /api/clinics/{id}/reject` | PUT | Reject clinic | Admin |
| `GET /api/clinics/verified` | GET | Lấy danh sách verified clinics | Public |

---

## 🎯 Use Cases

### **Use Case 1: Clinic Đăng Ký Mới**

1. Clinic gọi `POST /api/clinics` với thông tin
2. System tạo clinic với status = `pending`
3. Clinic nhận response: "Pending verification"
4. Clinic chờ Admin review

### **Use Case 2: Admin Verify Clinic**

1. Admin gọi `GET /api/clinics/pending` để xem danh sách
2. Admin review thông tin clinic
3. Admin gọi `PUT /api/clinics/{id}/verify` với optional notes
4. System chuyển status: `pending` → `verified`
5. Clinic có thể sử dụng đầy đủ tính năng

### **Use Case 3: Admin Reject Clinic**

1. Admin gọi `GET /api/clinics/pending` để xem danh sách
2. Admin phát hiện thông tin không hợp lệ
3. Admin gọi `PUT /api/clinics/{id}/reject` với rejection reason
4. System chuyển status: `pending` → `rejected`
5. Clinic không thể sử dụng tính năng

### **Use Case 4: Clinic Check Status**

1. Clinic gọi `GET /api/clinics/{id}/verification-status`
2. System trả về current status
3. Clinic biết được trạng thái xác minh

---

## ⚠️ Error Handling

### **Error 1: Verify Clinic Không Phải Pending**

**Request:** `PUT /api/clinics/1/verify` (clinic đã verified)

**Response:**
```json
{
  "message": "Cannot verify clinic. Current status: verified. Only clinics with 'pending' status can be verified.",
  "status": 400
}
```

### **Error 2: Reject Clinic Không Phải Pending**

**Request:** `PUT /api/clinics/1/reject` (clinic đã rejected)

**Response:**
```json
{
  "message": "Cannot reject clinic. Current status: rejected. Only clinics with 'pending' status can be rejected.",
  "status": 400
}
```

### **Error 3: Clinic Not Found**

**Request:** `GET /api/clinics/999/verification-status`

**Response:**
```json
{
  "message": "Clinic 999 not found",
  "status": 404
}
```

---

## 🔮 Future Enhancements

### **Possible Improvements:**

1. **Under Review Status**
   - Thêm status `under_review` giữa `pending` và `verified/rejected`
   - Workflow: `pending` → `under_review` → `verified/rejected`

2. **Re-verification**
   - Cho phép rejected clinic đăng ký lại
   - Reset status về `pending` sau khi update thông tin

3. **Verification History**
   - Lưu lịch sử verify/reject với timestamps
   - Lưu admin notes và rejection reasons

4. **Auto-verification**
   - Tự động verify clinic nếu thông tin hợp lệ (optional)
   - Dựa trên business rules

5. **Verification Documents**
   - Upload documents (license, certificates)
   - Admin review documents trước khi verify

---

## ✅ Checklist Implementation

- [x] Clinic registration với status = `pending`
- [x] Get pending clinics endpoint
- [x] Verify clinic endpoint với validation
- [x] Reject clinic endpoint với validation
- [x] Get verification status endpoint
- [x] Status transition validation
- [x] Error handling cho invalid transitions
- [ ] Admin authentication/authorization (cần implement)
- [ ] Audit trail (admin notes, rejection reasons)
- [ ] Re-verification flow (future)

---

## 📚 Related Files

- **Service:** `src/services/clinic_service.py`
- **Repository:** `src/infrastructure/repositories/clinic_repository.py`
- **Controller:** `src/api/controllers/clinic_controller.py`
- **Model:** `src/infrastructure/models/clinic_model.py`
- **Domain:** `src/domain/models/clinic.py`

---

**Status:** ✅ **100% Complete** - Workflow đã được implement đầy đủ với validation và error handling.
