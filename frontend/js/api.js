/**
 * AURA Frontend - API functions (skeleton)
 * Gọi API backend, sẽ được implement đầy đủ ở Phase 2+
 */

(function () {
  'use strict';

  const API_BASE = window.AURA_CONFIG ? window.AURA_CONFIG.API_BASE_URL : 'http://localhost:9999';

  function getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && window.AURA_CONFIG && window.AURA_CONFIG.STORAGE_KEYS) {
      const token = localStorage.getItem(window.AURA_CONFIG.STORAGE_KEYS.TOKEN);
      if (token) headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
  }

  function parseErrorMessage(res, data) {
    if (data && data.message) return data.message;
    if (data && data.error) return data.error;
    if (res.status === 422 && data && data.errors) {
      const err = data.errors;
      const parts = typeof err === 'object' ? Object.values(err).flat() : [err];
      return parts.filter(Boolean).join('. ') || 'Dữ liệu không hợp lệ.';
    }
    if (res.status === 401) return 'Email hoặc mật khẩu không đúng.';
    if (res.status === 409) return 'Email này đã được đăng ký.';
    if (res.status === 501) return data.message || 'Chức năng đang được cập nhật.';
    if (res.status >= 500) return data.message || 'Lỗi máy chủ. Vui lòng thử lại sau.';
    return data.message || 'Yêu cầu thất bại. Vui lòng thử lại.';
  }

  async function request(method, path, body = null, useAuth = true) {
    const opts = { method, headers: getHeaders(useAuth) };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      opts.body = JSON.stringify(body);
    }
    let res;
    try {
      res = await fetch(API_BASE + path, opts);
    } catch (e) {
      throw new Error('Không thể kết nối máy chủ. Kiểm tra backend đã chạy tại ' + API_BASE + ' chưa.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(parseErrorMessage(res, data));
    return data;
  }

  /** Login - POST /api/auth/login (không gửi token) */
  async function login(credentials) {
    return request('POST', '/api/auth/login', credentials, false);
  }

  /** Register - POST /api/auth/register (không gửi token) */
  async function register(payload) {
    return request('POST', '/api/auth/register', payload, false);
  }

  /** Forgot password - placeholder (backend chưa có endpoint) */
  async function forgotPassword(email) {
    return request('POST', '/api/auth/forgot-password', { email }, false);
  }

  /** Reset password - placeholder (backend chưa có endpoint) */
  async function resetPassword(token, newPassword) {
    return request('POST', '/api/auth/reset-password', { token, new_password: newPassword }, false);
  }

  /** Patient: lấy profile bệnh nhân theo account_id */
  async function getPatientByAccount(accountId) {
    const res = await request('GET', '/api/patients/account/' + accountId);
    return res.data;
  }

  /** Patient: danh sách ảnh võng mạc theo patient_id */
  async function getImagesByPatient(patientId, eyeSide) {
    let path = '/api/retinal-images/patient/' + patientId;
    if (eyeSide) path += '?eye_side=' + encodeURIComponent(eyeSide);
    const res = await request('GET', path);
    return res.data;
  }

  /** Patient: thống kê số ảnh theo patient_id */
  async function getImageStatsByPatient(patientId) {
    const res = await request('GET', '/api/retinal-images/stats?patient_id=' + patientId);
    return res.data;
  }

  /** Patient: upload ảnh (JSON: patient_id, clinic_id, uploaded_by, image_type, eye_side, image_url) */
  async function uploadImage(payload) {
    const res = await request('POST', '/api/retinal-images', payload);
    return res.data;
  }

  /** Patient: danh sách báo cáo theo patient_id */
  async function getReportsByPatient(patientId, limit) {
    let path = '/api/medical-reports/patient/' + patientId;
    if (limit) path += '?limit=' + limit;
    const res = await request('GET', path);
    return res.data;
  }

  /** Patient: tạo hồ sơ bệnh nhân (POST /api/patients) */
  async function createPatient(payload) {
    const res = await request('POST', '/api/patients', payload);
    return res.data;
  }

  /** Patient: cập nhật profile (PUT /api/patients/:id) */
  async function updatePatient(patientId, payload) {
    const res = await request('PUT', '/api/patients/' + patientId, payload);
    return res.data;
  }

  /** Patient: chi tiết bệnh nhân theo id (GET /api/patients/:id) - Doctor/Admin */
  async function getPatient(patientId) {
    const res = await request('GET', '/api/patients/' + patientId);
    return res.data;
  }

  /** Doctor: lấy bác sĩ theo account_id (GET /api/doctors/account/:id) */
  async function getDoctorByAccount(accountId) {
    const res = await request('GET', '/api/doctors/account/' + accountId);
    return res.data;
  }

  /** Doctor: thống kê hiệu suất (GET /api/doctors/:id/performance) */
  async function getDoctorPerformance(doctorId) {
    const res = await request('GET', '/api/doctors/' + doctorId + '/performance');
    return res.data;
  }

  /** Doctor: tạo hồ sơ bác sĩ (POST /api/doctors) */
  async function createDoctor(payload) {
    const res = await request('POST', '/api/doctors', payload);
    return res.data;
  }

  /** Doctor: cập nhật hồ sơ (PUT /api/doctors/:id) */
  async function updateDoctor(doctorId, payload) {
    const res = await request('PUT', '/api/doctors/' + doctorId, payload);
    return res.data;
  }

  /** Doctor: tìm kiếm bệnh nhân (GET /api/patients/search?name=&clinic_id=&risk_level=) */
  async function searchPatients(params) {
    const q = new URLSearchParams();
    if (params && params.name) q.set('name', params.name);
    if (params && params.clinic_id != null) q.set('clinic_id', params.clinic_id);
    if (params && params.risk_level) q.set('risk_level', params.risk_level);
    const query = q.toString();
    const res = await request('GET', '/api/patients/search' + (query ? '?' + query : ''));
    return res.data;
  }

  /** Doctor: danh sách phân tích chờ duyệt (GET /api/doctor-reviews/pending) */
  async function getPendingReviews() {
    const res = await request('GET', '/api/doctor-reviews/pending');
    return res.data;
  }

  /** Doctor: tạo review cho phân tích (POST /api/doctor-reviews) */
  async function createDoctorReview(payload) {
    const res = await request('POST', '/api/doctor-reviews', payload);
    return res.data;
  }

  /** Doctor: review theo analysis_id (GET /api/doctor-reviews/analysis/:id) */
  async function getReviewByAnalysis(analysisId) {
    const res = await request('GET', '/api/doctor-reviews/analysis/' + analysisId);
    return res.data;
  }

  /** Doctor: danh sách review của bác sĩ (GET /api/doctor-reviews/doctor/:id) */
  async function getReviewsByDoctor(doctorId) {
    const res = await request('GET', '/api/doctor-reviews/doctor/' + doctorId);
    return res.data;
  }

  /** Doctor: duyệt review (PUT /api/doctor-reviews/:id/approve) */
  async function approveReview(reviewId) {
    const res = await request('PUT', '/api/doctor-reviews/' + reviewId + '/approve', null);
    return res.data;
  }

  /** Doctor: từ chối review (PUT /api/doctor-reviews/:id/reject) body: { comment } */
  async function rejectReview(reviewId, comment) {
    const res = await request('PUT', '/api/doctor-reviews/' + reviewId + '/reject', { comment: comment || '' });
    return res.data;
  }

  /** Doctor: danh sách báo cáo của bác sĩ (GET /api/medical-reports/doctor/:id) */
  async function getReportsByDoctor(doctorId) {
    const res = await request('GET', '/api/medical-reports/doctor/' + doctorId);
    return res.data;
  }

  /** Doctor: tạo báo cáo y tế (POST /api/medical-reports) */
  async function createMedicalReport(payload) {
    const res = await request('POST', '/api/medical-reports', payload);
    return res.data;
  }

  /** Doctor: danh sách hội thoại (GET /api/conversations/doctor/:id) */
  async function getConversationsByDoctor(doctorId, activeOnly) {
    let path = '/api/conversations/doctor/' + doctorId;
    if (activeOnly) path += '?active_only=true';
    const res = await request('GET', path);
    return res.data;
  }

  /** AI Analysis: chi tiết phân tích (GET /api/ai-analysis/:id) */
  async function getAnalysis(analysisId) {
    const res = await request('GET', '/api/ai-analysis/' + analysisId);
    return res.data;
  }

  /** AI Analysis: phân tích theo bệnh nhân (GET /api/ai-analysis/patient/:id) */
  async function getPatientAnalyses(patientId, limit, offset) {
    let path = '/api/ai-analysis/patient/' + patientId;
    const q = [];
    if (limit != null) q.push('limit=' + limit);
    if (offset != null) q.push('offset=' + offset);
    if (q.length) path += '?' + q.join('&');
    const res = await request('GET', path);
    return res.data;
  }

  /** Messages: tin nhắn theo conversation (GET /api/messages/conversation/:id) */
  async function getMessagesByConversation(conversationId) {
    const res = await request('GET', '/api/messages/conversation/' + conversationId);
    return res.data;
  }

  /** Messages: gửi tin nhắn (POST /api/messages) */
  async function sendMessage(payload) {
    const res = await request('POST', '/api/messages', payload);
    return res.data;
  }

  window.AuraAPI = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    patch: (path, body) => request('PATCH', path, body),
    delete: (path) => request('DELETE', path),
    login,
    register,
    forgotPassword,
    resetPassword,
    getPatientByAccount,
    getImagesByPatient,
    getImageStatsByPatient,
    uploadImage,
    getReportsByPatient,
    createPatient,
    updatePatient,
    getPatient,
    getDoctorByAccount,
    getDoctorPerformance,
    createDoctor,
    updateDoctor,
    searchPatients,
    getPendingReviews,
    createDoctorReview,
    getReviewByAnalysis,
    getReviewsByDoctor,
    approveReview,
    rejectReview,
    getReportsByDoctor,
    createMedicalReport,
    getConversationsByDoctor,
    getAnalysis,
    getPatientAnalyses,
    getMessagesByConversation,
    sendMessage,
  };
})();
