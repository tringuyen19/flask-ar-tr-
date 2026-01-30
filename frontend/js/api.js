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
  };
})();
