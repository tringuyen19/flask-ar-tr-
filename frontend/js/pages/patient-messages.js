/**
 * AURA - Patient Messages (FR-10)
 * List conversations (getConversationsByPatient), load messages, send message (sender_type: patient)
 */
(function () {
  'use strict';

  if (!window.AuraAuth || !window.AuraAuth.requireLogin || !window.AuraAuth.requireLogin()) return;
  if (!window.AuraAuth.requireRole('Patient')) return;

  var user = window.AuraAuth.getUser();
  var accountId = user && user.account_id;
  var patientId = null;
  var patientName = '';

  var pageError = document.getElementById('pageError');
  var conversationsLoading = document.getElementById('conversationsLoading');
  var conversationsList = document.getElementById('conversationsList');
  var conversationsEmpty = document.getElementById('conversationsEmpty');
  var chatTitle = document.getElementById('chatTitle');
  var messagesPlaceholder = document.getElementById('messagesPlaceholder');
  var messagesList = document.getElementById('messagesList');
  var messageFormWrap = document.getElementById('messageFormWrap');
  var messageForm = document.getElementById('messageForm');
  var currentConversationId = document.getElementById('currentConversationId');
  var messageContent = document.getElementById('messageContent');
  var btnSend = document.getElementById('btnSend');

  function showError(msg) {
    if (!pageError) return;
    pageError.textContent = msg || '';
    pageError.classList.toggle('d-none', !msg);
  }

  function loadPatient(cb) {
    if (patientId) {
      if (cb) cb();
      return Promise.resolve();
    }
    if (!accountId) {
      showError('Không tìm thấy tài khoản.');
      return Promise.reject(new Error('No account'));
    }
    return window.AuraAPI.getPatientByAccount(accountId)
      .then(function (patient) {
        if (!patient || !patient.patient_id) {
          showError('Chưa có hồ sơ bệnh nhân. Vui lòng cập nhật Hồ sơ.');
          return Promise.reject(new Error('No patient profile'));
        }
        patientId = patient.patient_id;
        patientName = patient.patient_name || 'Bệnh nhân';
        if (cb) cb();
      });
  }

  function loadConversations() {
    if (!patientId) return;
    if (conversationsLoading) conversationsLoading.classList.remove('d-none');
    if (conversationsList) conversationsList.classList.add('d-none');
    if (conversationsEmpty) conversationsEmpty.classList.add('d-none');
    window.AuraAPI.getConversationsByPatient(patientId, false)
      .then(function (data) {
        if (conversationsLoading) conversationsLoading.classList.add('d-none');
        var list = (data && data.conversations) || [];
        if (!conversationsList) return;
        conversationsList.classList.remove('d-none');
        if (!list.length) {
          conversationsList.innerHTML = '<div class="list-group-item text-muted text-center py-4">Chưa có cuộc hội thoại nào. Bác sĩ sẽ tạo hội thoại khi cần trao đổi.</div>';
          if (conversationsEmpty) conversationsEmpty.classList.add('d-none');
          return;
        }
        if (conversationsEmpty) conversationsEmpty.classList.add('d-none');
        var html = '';
        list.forEach(function (c) {
          var label = 'Hội thoại với bác sĩ #' + (c.doctor_id || c.id);
          if (c.conversation_id) label = 'Hội thoại #' + c.conversation_id;
          html += '<a href="#" class="list-group-item list-group-item-action conversation-item" data-id="' + (c.conversation_id || c.id) + '">' + label + '</a>';
        });
        conversationsList.innerHTML = html;
        conversationsList.querySelectorAll('.conversation-item').forEach(function (el) {
          el.addEventListener('click', function (e) {
            e.preventDefault();
            var id = el.getAttribute('data-id');
            if (id) selectConversation(parseInt(id, 10));
          });
        });
      })
      .catch(function (err) {
        if (conversationsLoading) conversationsLoading.classList.add('d-none');
        if (conversationsList) {
          conversationsList.classList.remove('d-none');
          conversationsList.innerHTML = '<div class="list-group-item text-danger text-center py-4">' + (err.message || 'Không tải được danh sách.') + '</div>';
        }
        showError(err.message || 'Tải hội thoại thất bại.');
      });
  }

  function selectConversation(conversationId) {
    if (currentConversationId) currentConversationId.value = conversationId;
    if (chatTitle) chatTitle.textContent = 'Hội thoại #' + conversationId;
    if (messagesPlaceholder) messagesPlaceholder.classList.add('d-none');
    if (messagesList) {
      messagesList.classList.remove('d-none');
      messagesList.innerHTML = '<div class="text-center py-3">Đang tải tin nhắn...</div>';
    }
    if (messageFormWrap) messageFormWrap.classList.remove('d-none');
    window.AuraAPI.getMessagesByConversation(conversationId)
      .then(function (data) {
        var list = (data && data.messages) || [];
        if (!messagesList) return;
        if (!list.length) {
          messagesList.innerHTML = '<p class="text-muted text-center mb-0">Chưa có tin nhắn.</p>';
          return;
        }
        var html = '';
        list.forEach(function (m) {
          var isPatient = (m.sender_type || '').toLowerCase() === 'patient';
          var align = isPatient ? 'end' : 'start';
          html += '<div class="d-flex justify-content-' + align + ' mb-2">' +
            '<div class="rounded px-3 py-2 ' + (isPatient ? 'bg-primary text-white' : 'bg-light') + '" style="max-width: 80%;">' +
            '<small class="d-block opacity-75">' + (m.sender_name || '') + '</small>' +
            '<span>' + (m.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>' +
            '</div></div>';
        });
        messagesList.innerHTML = html;
        messagesList.scrollTop = messagesList.scrollHeight;
      })
      .catch(function (err) {
        if (messagesList) messagesList.innerHTML = '<p class="text-danger text-center mb-0">' + (err.message || 'Không tải được tin nhắn.') + '</p>';
      });
    if (conversationsList) {
      conversationsList.querySelectorAll('.conversation-item').forEach(function (el) {
        el.classList.toggle('active', parseInt(el.getAttribute('data-id'), 10) === conversationId);
      });
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    var cid = currentConversationId && currentConversationId.value ? parseInt(currentConversationId.value, 10) : null;
    var content = messageContent && messageContent.value ? messageContent.value.trim() : '';
    if (!cid || !content) return;
    if (btnSend) btnSend.disabled = true;
    window.AuraAPI.sendMessage({
      conversation_id: cid,
      sender_type: 'patient',
      sender_name: patientName,
      content: content
    })
      .then(function () {
        if (messageContent) messageContent.value = '';
        selectConversation(cid);
      })
      .catch(function (err) {
        showError(err.message || 'Gửi tin nhắn thất bại.');
        if (window.AuraAlert && window.AuraAlert.toast) {
          window.AuraAlert.toast(err.message || 'Gửi thất bại.', 'danger');
        }
      })
      .finally(function () {
        if (btnSend) btnSend.disabled = false;
      });
  }

  if (messageForm) {
    messageForm.addEventListener('submit', sendMessage);
  }

  loadPatient(function () {
    loadConversations();
  });
})();
