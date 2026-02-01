/**
 * AURA - Patient Analysis Results
 * Hiển thị kết quả phân tích từ ai_analysis (patient_id -> image_id -> analysis_id -> result_id).
 * Gọi trực tiếp GET /api/ai-analysis/patient/:id và GET /api/retinal-images/patient/:id để tránh cache/thiếu request.
 */
(function () {
  'use strict';

  if (!window.AuraAuth || !window.AuraAuth.requireLogin || !window.AuraAuth.requireLogin()) return;

  var user = window.AuraAuth.getUser();
  var accountId = user && user.account_id;
  var patientId = null;
  var listEl = document.getElementById('analysisList');

  var API_BASE = (window.AURA_CONFIG && window.AURA_CONFIG.API_BASE_URL) || 'http://localhost:9999';
  var TOKEN_KEY = (window.AURA_CONFIG && window.AURA_CONFIG.STORAGE_KEYS && window.AURA_CONFIG.STORAGE_KEYS.TOKEN) || 'aura_access_token';

  function authHeaders() {
    var h = { 'Content-Type': 'application/json' };
    var t = localStorage.getItem(TOKEN_KEY);
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  }

  function getPatient() {
    if (!accountId) return Promise.reject(new Error('Không tìm thấy tài khoản.'));
    return window.AuraAPI.getPatientByAccount(accountId).then(function (p) {
      if (!p || !p.patient_id) return Promise.reject(new Error('Chưa có hồ sơ bệnh nhân.'));
      patientId = p.patient_id;
      return patientId;
    });
  }

  /** Gọi trực tiếp GET /api/ai-analysis/patient/:id (luôn thấy trong log backend) */
  function fetchAnalyses(pid) {
    return fetch(API_BASE + '/api/ai-analysis/patient/' + pid + '?limit=50&offset=0', {
      method: 'GET',
      headers: authHeaders()
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || d.error || 'Lỗi ' + r.status); });
      return r.json();
    }).then(function (body) {
      return (body && body.data) ? body.data : body;
    });
  }

  /** Gọi trực tiếp GET /api/retinal-images/patient/:id */
  function fetchImages(pid) {
    return fetch(API_BASE + '/api/retinal-images/patient/' + pid, {
      method: 'GET',
      headers: authHeaders()
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || d.error || 'Lỗi ' + r.status); });
      return r.json();
    }).then(function (body) {
      return (body && body.data) ? body.data : body;
    });
  }

  /** Lấy kết quả AI cho một phân tích (disease_type, risk_level, confidence_score) */
  function fetchResultByAnalysis(analysisId) {
    return fetch(API_BASE + '/api/ai-results/analysis/' + analysisId, {
      method: 'GET',
      headers: authHeaders()
    }).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    }).then(function (body) {
      var data = (body && body.data) ? body.data : body;
      var list = (data && data.results) ? data.results : [];
      return list.length ? list[0] : null;
    }).catch(function () { return null; });
  }

  getPatient()
    .then(function () {
      return Promise.all([
        fetchAnalyses(patientId),
        fetchImages(patientId)
      ]);
    })
    .then(function (results) {
      var analysesData = results[0] || {};
      var imagesData = results[1] || {};
      var analyses = analysesData.analyses || [];
      var images = imagesData.images || [];
      var completed = analyses.filter(function (a) { return (a.status || '').toLowerCase() === 'completed'; });
      if (!listEl) return;
      if (!completed.length) {
        listEl.innerHTML = '<div class="col-12"><div class="card border-0 shadow-sm"><div class="card-body text-center text-muted py-5">Chưa có kết quả phân tích. <a href="upload-image.html">Upload ảnh</a> để bắt đầu.</div></div></div>';
        return;
      }
      var imageById = {};
      images.forEach(function (img) { imageById[img.image_id] = img; });
      return Promise.all(completed.map(function (a) { return fetchResultByAnalysis(a.analysis_id).then(function (res) { return { analysis: a, result: res }; }); }))
        .then(function (withResults) {
          listEl.innerHTML = withResults.map(function (item) {
            var a = item.analysis;
            var res = item.result;
            var img = imageById[a.image_id] || {};
            var imgUrl = img.image_url || '';
            var imgType = img.image_type || '-';
            var eyeSide = img.eye_side || '-';
            var timeStr = a.analysis_time ? String(a.analysis_time).slice(0, 19).replace('T', ' ') : '-';
            var disease = res && res.disease_type ? res.disease_type : '-';
            var risk = res && res.risk_level ? res.risk_level : '-';
            var conf = res && res.confidence_score != null ? (Math.round(parseFloat(res.confidence_score) * 100) + '%') : '-';
            var reportBlock = res
              ? '<p class="card-text small mb-1"><strong>Loại bệnh:</strong> ' + disease + '</p>' +
                '<p class="card-text small mb-1"><strong>Mức độ rủi ro:</strong> <span class="badge bg-' + (risk === 'high' || risk === 'critical' ? 'danger' : risk === 'medium' ? 'warning' : 'secondary') + '">' + risk + '</span></p>' +
                '<p class="card-text small mb-2"><strong>Độ tin cậy AI:</strong> ' + conf + '</p>'
              : '';
            return '<div class="col-md-4"><div class="card border-0 shadow-sm h-100">' +
              (imgUrl ? '<img src="' + imgUrl + '" class="card-img-top" alt="Ảnh" style="height: 180px; object-fit: cover;">' : '<div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 180px;"><span class="text-muted">Ảnh #' + (a.image_id || '') + '</span></div>') +
              '<div class="card-body"><h6 class="card-title">Phân tích #' + (a.analysis_id || '') + '</h6>' +
              '<p class="card-text small text-muted">Loại: ' + imgType + ' | Mắt: ' + eyeSide + '</p>' +
              '<p class="card-text small text-muted">' + timeStr + '</p>' +
              reportBlock +
              '<a href="reports.html" class="btn btn-sm btn-outline-primary">Xem báo cáo</a></div></div></div>';
          }).join('');
        });
    })
    .catch(function (err) {
      if (listEl) listEl.innerHTML = '<div class="col-12"><div class="alert alert-warning">' + (err.message || 'Không tải được dữ liệu.') + '</div></div>';
    });
})();
