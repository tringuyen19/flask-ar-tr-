/**
 * AURA - Patient Subscriptions (FR-11)
 * - Gói của tôi: subscription_id → account_id (patient: account_id từ JWT)
 * - Lịch sử thanh toán: payment_id → subscription_id → account_id
 * - Gói dịch vụ có sẵn: từ bảng dbo.service_packages (packages 4,5,6,7,8...)
 */
(function () {
  'use strict';

  var pageError = document.getElementById('pageError');
  var packagesLoading = document.getElementById('packagesLoading');
  var packagesList = document.getElementById('packagesList');
  var packagesEmpty = document.getElementById('packagesEmpty');
  var mySubscriptionsLoading = document.getElementById('mySubscriptionsLoading');
  var mySubscriptionsList = document.getElementById('mySubscriptionsList');
  var mySubscriptionsEmpty = document.getElementById('mySubscriptionsEmpty');
  var paymentHistoryLoading = document.getElementById('paymentHistoryLoading');
  var paymentHistoryList = document.getElementById('paymentHistoryList');
  var paymentHistoryEmpty = document.getElementById('paymentHistoryEmpty');

  function showError(msg) {
    if (!pageError) return;
    pageError.textContent = msg || '';
    pageError.classList.toggle('d-none', !msg);
  }

  function hideAllLoadings() {
    [packagesLoading, mySubscriptionsLoading, paymentHistoryLoading].forEach(function (el) {
      if (el) el.classList.add('d-none');
    });
  }

  function showEmptyStates() {
    var mySubsEmpty = document.getElementById('mySubscriptionsEmpty');
    var pkgEmpty = document.getElementById('packagesEmpty');
    var payEmpty = document.getElementById('paymentHistoryEmpty');
    if (mySubsEmpty) mySubsEmpty.classList.remove('d-none');
    if (pkgEmpty) pkgEmpty.classList.remove('d-none');
    if (payEmpty) payEmpty.classList.remove('d-none');
  }

  if (!window.AuraAuth || !window.AuraAuth.requireLogin) {
    hideAllLoadings();
    showError('Trang cần đăng nhập. Vui lòng tải lại hoặc đăng nhập.');
    showEmptyStates();
    return;
  }
  if (!window.AuraAuth.requireLogin()) return;
  if (!window.AuraAuth.requireRole('Patient')) return;

  var user = window.AuraAuth.getUser();
  var accountId = (user && (user.account_id != null ? user.account_id : user.id)) || null;
  var modalPurchase = document.getElementById('modalPurchase') ? new (window.bootstrap && window.bootstrap.Modal)(document.getElementById('modalPurchase')) : null;
  var modalRenew = document.getElementById('modalRenew') ? new (window.bootstrap && window.bootstrap.Modal)(document.getElementById('modalRenew')) : null;
  var selectedPackage = null;

  if (!accountId) {
    showError('Vui lòng đăng nhập với tài khoản bệnh nhân.');
    showEmptyStates();
    hideAllLoadings();
    return;
  }

  function formatMoney(n) {
    if (n == null || n === '') return '-';
    var x = Number(n);
    return isNaN(x) ? '-' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(x);
  }

  function formatDate(s) {
    if (!s) return '-';
    var d = typeof s === 'string' ? s.slice(0, 10) : s;
    return d;
  }

  function loadPackages() {
    if (!packagesList) return;
    if (packagesLoading) packagesLoading.classList.remove('d-none');
    packagesList.classList.add('d-none');
    if (packagesEmpty) packagesEmpty.classList.add('d-none');
    window.AuraAPI.getServicePackages()
      .then(function (data) {
        var raw = Array.isArray(data) ? data : (data && data.packages) || (data && data.data && data.data.packages) || [];
        var list = raw;
        if (list.length && window.AURA_SUBSCRIPTION_PACKAGE_IDS && Array.isArray(window.AURA_SUBSCRIPTION_PACKAGE_IDS)) {
          list = raw.filter(function (p) {
            var id = p.package_id || p.id;
            return window.AURA_SUBSCRIPTION_PACKAGE_IDS.indexOf(id) !== -1;
          });
        }
        if (!list.length) {
          if (packagesEmpty) packagesEmpty.classList.remove('d-none');
          return;
        }
        packagesList.classList.remove('d-none');
        packagesList.innerHTML = list.map(function (p) {
          var pid = p.package_id || p.id;
          var name = p.name || 'Gói #' + pid;
          var price = p.price != null ? p.price : 0;
          var limit = p.image_limit != null ? p.image_limit : 0;
          var days = p.duration_days != null ? p.duration_days : 0;
          return '<div class="col-md-6 col-lg-4">' +
            '<div class="card border-0 shadow-sm h-100">' +
            '<div class="card-body">' +
            '<h5 class="card-title">' + name + '</h5>' +
            '<p class="text-primary fw-bold mb-1">' + formatMoney(price) + '</p>' +
            '<p class="small text-muted mb-2">' + limit + ' lượt phân tích · ' + days + ' ngày</p>' +
            '<button type="button" class="btn btn-primary btn-sm btn-purchase" data-package-id="' + pid + '" data-name="' + (name.replace(/"/g, '&quot;')) + '" data-price="' + price + '" data-image-limit="' + limit + '" data-duration-days="' + days + '">Mua gói</button>' +
            '</div></div></div>';
        }).join('');
        packagesList.querySelectorAll('.btn-purchase').forEach(function (btn) {
          btn.addEventListener('click', function () {
            selectedPackage = {
              package_id: parseInt(btn.getAttribute('data-package-id'), 10),
              name: btn.getAttribute('data-name'),
              price: parseFloat(btn.getAttribute('data-price')) || 0,
              image_limit: parseInt(btn.getAttribute('data-image-limit'), 10) || 0,
              duration_days: parseInt(btn.getAttribute('data-duration-days'), 10) || 30
            };
            if (document.getElementById('modalPurchasePackageName')) document.getElementById('modalPurchasePackageName').textContent = 'Gói: ' + selectedPackage.name;
            if (document.getElementById('modalPurchaseAmount')) document.getElementById('modalPurchaseAmount').textContent = 'Số tiền: ' + formatMoney(selectedPackage.price);
            if (modalPurchase) modalPurchase.show();
          });
        });
      })
      .catch(function (err) {
        if (typeof console !== 'undefined' && console.error) console.error('Packages:', err);
        showError(err.message || 'Không tải được danh sách gói.');
        if (packagesEmpty) packagesEmpty.classList.remove('d-none');
      })
      .finally(function () {
        if (packagesLoading) packagesLoading.classList.add('d-none');
      });
  }

  function loadMySubscriptions() {
    if (!mySubscriptionsList) return;
    if (mySubscriptionsLoading) mySubscriptionsLoading.classList.remove('d-none');
    mySubscriptionsList.classList.add('d-none');
    if (mySubscriptionsEmpty) mySubscriptionsEmpty.classList.add('d-none');
    window.AuraAPI.getSubscriptionsByAccount(accountId)
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data && data.subscriptions) || (data && data.data && data.data.subscriptions) || [];
        if (!list.length) {
          if (mySubscriptionsEmpty) mySubscriptionsEmpty.classList.remove('d-none');
          return;
        }
        mySubscriptionsList.classList.remove('d-none');
        mySubscriptionsList.innerHTML = '<div class="table-responsive"><table class="table table-sm mb-0"><thead><tr><th>ID</th><th>Trạng thái</th><th>Lượt còn lại</th><th>Hết hạn</th><th></th></tr></thead><tbody>' +
          list.map(function (s) {
            var sid = s.subscription_id || s.id;
            var status = (s.status || '').toLowerCase();
            var badge = status === 'active' ? 'bg-success' : (status === 'expired' ? 'bg-secondary' : 'bg-warning text-dark');
            var endDate = s.end_date ? formatDate(s.end_date) : '-';
            var credits = s.remaining_credits != null ? s.remaining_credits : '-';
            var renewBtn = (status === 'active' || status === 'expired') ? '<button type="button" class="btn btn-outline-primary btn-sm btn-renew" data-id="' + sid + '">Gia hạn</button>' : '';
            return '<tr><td>' + sid + '</td><td><span class="badge ' + badge + '">' + (s.status || '-') + '</span></td><td>' + credits + '</td><td>' + endDate + '</td><td>' + renewBtn + '</td></tr>';
          }).join('') + '</tbody></table></div>';
        mySubscriptionsList.querySelectorAll('.btn-renew').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var id = parseInt(btn.getAttribute('data-id'), 10);
            if (document.getElementById('modalRenewSubscriptionId')) document.getElementById('modalRenewSubscriptionId').value = id;
            if (document.getElementById('modalRenewDays')) document.getElementById('modalRenewDays').value = 30;
            if (document.getElementById('modalRenewCredits')) document.getElementById('modalRenewCredits').value = 50;
            if (modalRenew) modalRenew.show();
          });
        });
      })
      .catch(function (err) {
        if (typeof console !== 'undefined' && console.error) console.error('My subscriptions:', err);
        showError(err.message || 'Không tải được gói của tôi.');
        if (mySubscriptionsEmpty) mySubscriptionsEmpty.classList.remove('d-none');
      })
      .finally(function () {
        if (mySubscriptionsLoading) mySubscriptionsLoading.classList.add('d-none');
      });
  }

  function doPurchase() {
    if (!selectedPackage || !accountId) return;
    var btn = document.getElementById('btnConfirmPurchase');
    var methodEl = document.getElementById('modalPaymentMethod');
    var method = methodEl ? methodEl.value : 'e_wallet';
    if (btn) btn.disabled = true;
    showError('');
    window.AuraAPI.createSubscription({
      account_id: accountId,
      package_id: selectedPackage.package_id,
      remaining_credits: selectedPackage.image_limit
    })
      .then(function (sub) {
        var subId = sub.subscription_id || sub.id;
        return window.AuraAPI.createPayment({
          subscription_id: subId,
          amount: selectedPackage.price,
          payment_method: method,
          status: 'completed'
        }).then(function () { return subId; });
      })
      .then(function () {
        if (window.AuraAlert && window.AuraAlert.toast) window.AuraAlert.toast('Mua gói thành công.', 'success');
        if (modalPurchase) modalPurchase.hide();
        selectedPackage = null;
        loadMySubscriptions();
        loadPackages();
      })
      .catch(function (err) {
        showError(err.message || 'Mua gói thất bại.');
        if (window.AuraAlert && window.AuraAlert.toast) window.AuraAlert.toast(err.message || 'Thất bại.', 'danger');
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  }

  function loadPaymentHistory() {
    if (!paymentHistoryList) return;
    if (paymentHistoryLoading) paymentHistoryLoading.classList.remove('d-none');
    paymentHistoryList.classList.add('d-none');
    if (paymentHistoryEmpty) paymentHistoryEmpty.classList.add('d-none');
    window.AuraAPI.getPaymentHistoryByAccount(accountId, 20, 0)
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data && data.payments) || (data && data.data && data.data.payments) || [];
        if (!list.length) {
          if (paymentHistoryEmpty) paymentHistoryEmpty.classList.remove('d-none');
          return;
        }
        paymentHistoryList.classList.remove('d-none');
        paymentHistoryList.innerHTML = '<div class="table-responsive"><table class="table table-sm mb-0"><thead><tr><th>Thời gian</th><th>Số tiền</th><th>Phương thức</th><th>Trạng thái</th></tr></thead><tbody>' +
          list.map(function (p) {
            var time = p.payment_time ? formatDate(p.payment_time) : '-';
            var amount = formatMoney(p.amount);
            var method = (p.payment_method || '-').replace(/_/g, ' ');
            var status = (p.status || '-');
            return '<tr><td>' + time + '</td><td>' + amount + '</td><td>' + method + '</td><td>' + status + '</td></tr>';
          }).join('') + '</tbody></table></div>';
      })
      .catch(function (err) {
        if (typeof console !== 'undefined' && console.error) console.error('Payment history:', err);
        showError(err.message || 'Không tải được lịch sử thanh toán.');
        if (paymentHistoryEmpty) paymentHistoryEmpty.classList.remove('d-none');
      })
      .finally(function () {
        if (paymentHistoryLoading) paymentHistoryLoading.classList.add('d-none');
      });
  }

  function doRenew() {
    var idEl = document.getElementById('modalRenewSubscriptionId');
    var daysEl = document.getElementById('modalRenewDays');
    var creditsEl = document.getElementById('modalRenewCredits');
    var sid = idEl ? parseInt(idEl.value, 10) : 0;
    var days = daysEl ? parseInt(daysEl.value, 10) : 30;
    var credits = creditsEl ? parseInt(creditsEl.value, 10) : 50;
    if (!sid || days < 1 || credits < 1) return;
    var btn = document.getElementById('btnConfirmRenew');
    if (btn) btn.disabled = true;
    showError('');
    window.AuraAPI.renewSubscription(sid, days, credits)
      .then(function () {
        if (window.AuraAlert && window.AuraAlert.toast) window.AuraAlert.toast('Gia hạn thành công.', 'success');
        if (modalRenew) modalRenew.hide();
        loadMySubscriptions();
      })
      .catch(function (err) {
        showError(err.message || 'Gia hạn thất bại.');
        if (window.AuraAlert && window.AuraAlert.toast) window.AuraAlert.toast(err.message || 'Thất bại.', 'danger');
      })
      .finally(function () {
        if (btn) btn.disabled = false;
      });
  }

  if (document.getElementById('btnConfirmPurchase')) {
    document.getElementById('btnConfirmPurchase').addEventListener('click', doPurchase);
  }
  if (document.getElementById('btnConfirmRenew')) {
    document.getElementById('btnConfirmRenew').addEventListener('click', doRenew);
  }
  var linkToPaymentHistory = document.getElementById('linkToPaymentHistory');
  if (linkToPaymentHistory) {
    linkToPaymentHistory.href = '#paymentHistory';
    linkToPaymentHistory.addEventListener('click', function (e) {
      e.preventDefault();
      var el = document.getElementById('paymentHistorySection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Đợi 1 tick để api.js chắc chắn đã gắn window.AuraAPI rồi mới gọi API
  setTimeout(function () {
    if (!window.AuraAPI || typeof window.AuraAPI.getServicePackages !== 'function') {
      showError('API chưa sẵn sàng. Vui lòng tải lại trang (F5).');
      showEmptyStates();
      hideAllLoadings();
      return;
    }
    loadPackages();
    loadMySubscriptions();
    loadPaymentHistory();
  }, 0);
})();
