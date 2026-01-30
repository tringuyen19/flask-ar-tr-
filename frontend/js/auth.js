/**
 * AURA Frontend - Authentication
 * Lưu/xóa token, kiểm tra đăng nhập, redirect theo role
 */

(function () {
  'use strict';

  const KEYS = window.AURA_CONFIG && window.AURA_CONFIG.STORAGE_KEYS
    ? window.AURA_CONFIG.STORAGE_KEYS
    : { TOKEN: 'aura_access_token', USER: 'aura_user', ROLE: 'aura_role' };

  function getToken() {
    return localStorage.getItem(KEYS.TOKEN);
  }

  function getUser() {
    try {
      const raw = localStorage.getItem(KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function getRole() {
    return localStorage.getItem(KEYS.ROLE) || '';
  }

  function setAuth(token, user, role) {
    if (token) localStorage.setItem(KEYS.TOKEN, token);
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    if (role) localStorage.setItem(KEYS.ROLE, role);
  }

  function clearAuth() {
    localStorage.removeItem(KEYS.TOKEN);
    if (KEYS.REFRESH_TOKEN) localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.ROLE);
  }

  function isLoggedIn() {
    return !!getToken();
  }

  /** Redirect về login nếu chưa đăng nhập (dùng cho trang cần bảo vệ) */
  function requireLogin(loginUrl) {
    if (!isLoggedIn()) {
      const url = loginUrl || 'login.html';
      window.location.href = url;
      return false;
    }
    return true;
  }

  function redirectByRole() {
    const role = getRole();
    const base = window.location.pathname.replace(/\/[^/]*$/, '') || '';
    const map = { Patient: '/patient/dashboard.html', Doctor: '/doctor/dashboard.html', ClinicManager: '/clinic/dashboard.html', Admin: '/admin/dashboard.html' };
    const path = map[role] || '/index.html';
    window.location.href = base + path;
  }

  window.AuraAuth = {
    getToken,
    getUser,
    getRole,
    setAuth,
    clearAuth,
    isLoggedIn,
    requireLogin,
    redirectByRole,
  };
})();
