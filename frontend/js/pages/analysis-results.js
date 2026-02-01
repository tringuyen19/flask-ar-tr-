/**
 * AURA - Patient Analysis Results
 * Hiển thị danh sách kết quả phân tích AI theo bệnh nhân (GET /api/ai-analysis/patient/:id)
 */
(function () {
  'use strict';

  if (!window.AuraAuth || !window.AuraAuth.requireRole || !window.AuraAuth.requireRole('Patient')) return;

  var user = window.AuraAuth.getUser();
  var accountId = user && user.account_id;
  var patientId = null;
  var listEl = document.getElementById('analysisList');

  function getPatient() {
    if (!accountId) return Promise.reject(new Error('Không tìm thấy tài khoản.'));
    return window.AuraAPI.getPatientByAccount(accountId).then(function (p) {
      if (!p || !p.patient_id) return Promise.reject(new Error('Chưa có hồ sơ bệnh nhân.'));
      patientId = p.patient_id;
      return patientId;
    });
  }

  getPatient()
    .then(function () { return window.AuraAPI.getPatientAnalyses(patientId, 50, 0); })
    .then(function (data) {
      var analyses = (data && data.analyses) || [];
      if (!listEl) return;
      if (!analyses.length) {
        listEl.innerHTML = '<div class="col-12"><div class="card border-0 shadow-sm"><div class="card-body text-center text-muted py-5">Chưa có kết quả phân tích. <a href="upload-image.html">Upload ảnh</a> và chờ bác sĩ/phòng khám tạo phân tích AI.</div></div></div>';
        return;
      }
      listEl.innerHTML = analyses.map(function (a) {
        var dateStr = (a.analysis_time || a.completed_at) ? new Date(a.analysis_time || a.completed_at).toLocaleDateString('vi-VN') : '-';
        var statusClass = a.status === 'completed' ? 'success' : (a.status === 'failed' ? 'danger' : 'secondary');
        return '<div class="col-md-4"><div class="card border-0 shadow-sm h-100">' +
          '<div class="card-body"><h6 class="card-title">Phân tích #' + (a.analysis_id || a.id) + '</h6>' +
          '<p class="card-text small text-muted">Ảnh #' + (a.image_id || '-') + ' | ' + dateStr + '</p>' +
          '<span class="badge bg-' + statusClass + '">' + (a.status || '-') + '</span> ' +
          '<a href="reports.html" class="btn btn-sm btn-outline-primary mt-2">Xem báo cáo</a></div></div></div>';
      }).join('');
    })
    .catch(function (err) {
      if (listEl) listEl.innerHTML = '<div class="col-12"><div class="alert alert-warning">' + (err.message || 'Không tải được dữ liệu.') + '</div></div>';
    });
})();
