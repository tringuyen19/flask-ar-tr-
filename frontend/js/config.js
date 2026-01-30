/**
 * AURA Frontend - Cấu hình cơ bản
 * API URL, constants, app settings
 */

const AURA_CONFIG = {
  // API Backend (Flask chạy mặc định port 5000)
  API_BASE_URL: window.location.origin.includes('localhost')
    ? 'http://localhost:5000'
    : window.location.origin,

  // Tên ứng dụng
  APP_NAME: 'AURA',
  APP_DESCRIPTION: 'AI-Powered Retinal Disease Detection',

  // Storage keys
  STORAGE_KEYS: {
    TOKEN: 'aura_access_token',
    REFRESH_TOKEN: 'aura_refresh_token',
    USER: 'aura_user',
    ROLE: 'aura_role',
  },

  // Roles (khớp backend)
  ROLES: {
    PATIENT: 'Patient',
    DOCTOR: 'Doctor',
    CLINIC_MANAGER: 'ClinicManager',
    ADMIN: 'Admin',
  },

  // Pagination mặc định
  DEFAULT_PAGE_SIZE: 10,
};

// Export cho dùng trong các module khác (nếu dùng type="module")
if (typeof window !== 'undefined') {
  window.AURA_CONFIG = AURA_CONFIG;
}
