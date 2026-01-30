/**
 * AURA Frontend - Utility functions
 */

(function () {
  'use strict';

  function showToast(message, type = 'info') {
    if (typeof window.bootstrap !== 'undefined') {
      // Có thể dùng Bootstrap toast sau khi có template
      console.log('[AURA]', type, message);
    } else {
      console.log('[AURA]', type, message);
    }
  }

  function formatDate(str) {
    if (!str) return '';
    const d = new Date(str);
    return isNaN(d.getTime()) ? str : d.toLocaleDateString('vi-VN');
  }

  function formatDateTime(str) {
    if (!str) return '';
    const d = new Date(str);
    return isNaN(d.getTime()) ? str : d.toLocaleString('vi-VN');
  }

  function escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), ms);
    };
  }

  window.AuraUtils = {
    showToast,
    formatDate,
    formatDateTime,
    escapeHtml,
    debounce,
  };
})();
