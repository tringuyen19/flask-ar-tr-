/**
 * AURA Frontend - API functions (skeleton)
 * Gọi API backend, sẽ được implement đầy đủ ở Phase 2+
 */

(function () {
  'use strict';

  const API_BASE = window.AURA_CONFIG ? window.AURA_CONFIG.API_BASE_URL : 'http://localhost:5000';

  function getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && window.AURA_CONFIG && window.AURA_CONFIG.STORAGE_KEYS) {
      const token = localStorage.getItem(window.AURA_CONFIG.STORAGE_KEYS.TOKEN);
      if (token) headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
  }

  async function request(method, path, body = null) {
    const opts = { method, headers: getHeaders() };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(API_BASE + path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
    return data;
  }

  window.AuraAPI = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    patch: (path, body) => request('PATCH', path, body),
    delete: (path) => request('DELETE', path),
  };
})();
