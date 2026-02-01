/**
 * AURA - Patient Analysis Results (FR-3, FR-4, FR-6)
 * Hiển thị lịch sử phân tích, kết quả chẩn đoán AI (risk, disease), hình ảnh chú thích (heatmap)
 */
(function () {
  'use strict';

  if (!window.AuraAuth || !window.AuraAuth.requireLogin || !window.AuraAuth.requireLogin()) return;

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

  function riskBadgeClass(risk) {
    var r = (risk || '').toLowerCase();
    if (r === 'critical' || r === 'high') return 'bg-danger';
    if (r === 'medium') return 'bg-warning text-dark';
    return 'bg-success';
  }

  getPatient()
    .then(function () { return window.AuraAPI.getPatientAnalyses(patientId, 30, 0); })
    .then(function (data) {
      var analyses = (data && data.analyses) || [];
      if (!listEl) return;
      if (!analyses.length) {
        listEl.innerHTML = '<div class="col-12"><div class="card border-0 shadow-sm"><div class="card-body text-center text-muted py-5">Chưa có kết quả phân tích. <a href="upload-image.html">Upload ảnh</a> rồi yêu cầu phân tích để bắt đầu.</div></div></div>';
        return;
      }
      var html = analyses.map(function (a) {
        var aid = a.analysis_id || a.id;
        return '<div class="col-md-6 col-lg-4 analysis-card" data-analysis-id="' + aid + '">' +
          '<div class="card border-0 shadow-sm h-100">' +
          '<div class="card-body">' +
          '<h6 class="card-title">Phân tích #' + aid + '</h6>' +
          '<p class="small text-muted mb-2">Ảnh #' + (a.image_id || '-') + ' · ' + (a.status || '-') + '</p>' +
          '<div class="analysis-detail mb-2" data-aid="' + aid + '"><span class="text-muted small">Đang tải kết quả...</span></div>' +
          '<a href="#" class="btn btn-sm btn-outline-primary view-detail" data-aid="' + aid + '">Xem chi tiết &amp; ảnh chú thích</a>' +
          '</div></div></div>';
      }).join('');
      listEl.innerHTML = html;

      analyses.forEach(function (a) {
        var aid = a.analysis_id || a.id;
        var detailEl = listEl.querySelector('.analysis-detail[data-aid="' + aid + '"]');
        if (!detailEl) return;
        Promise.all([
          window.AuraAPI.getResultsByAnalysis(aid).catch(function () { return { results: [] }; }),
          window.AuraAPI.getAnnotationByAnalysis(aid).catch(function () { return null; })
        ]).then(function (out) {
          var results = (out[0] && out[0].results) || [];
          var annotation = out[1];
          var risk = results.length ? (results[0].risk_level || '-') : '-';
          var disease = results.length ? (results[0].disease_type || '-') : '-';
          var conf = results.length && results[0].confidence_score != null ? (results[0].confidence_score + '%') : '-';
          var heatmap = annotation && (annotation.heatmap_url || annotation.heatmap_url) ? (annotation.heatmap_url) : null;
          var content = '<span class="badge ' + riskBadgeClass(risk) + ' me-1">' + risk + '</span> ' +
            (disease !== '-' ? '<span class="text-muted small">' + disease + '</span> ' : '') +
            (conf !== '-' ? '<span class="small">(' + conf + ')</span>' : '');
          detailEl.innerHTML = content;
          var card = listEl.querySelector('.analysis-card[data-analysis-id="' + aid + '"]');
          if (card) {
            var btn = card.querySelector('.view-detail');
            if (btn) {
              btn.addEventListener('click', function (e) {
                e.preventDefault();
                var msg = 'Kết quả: ' + risk + (disease !== '-' ? ' · ' + disease : '') + (conf !== '-' ? ' · Độ tin cậy ' + conf : '');
                if (heatmap) msg += '\nẢnh chú thích: ' + heatmap;
                if (heatmap) window.open(heatmap, '_blank');
                else if (window.AuraUtils && window.AuraUtils.showToast) window.AuraUtils.showToast(msg, 'info');
              });
            }
          }
        });
      });
    })
    .catch(function (err) {
      if (listEl) listEl.innerHTML = '<div class="col-12"><div class="alert alert-warning">' + (err.message || 'Không tải được dữ liệu.') + '</div></div>';
    });
})();
