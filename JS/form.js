/* form.js - validation for the "Request a Free Estimate" form.
   - The form uses novalidate so these messages replace the browser's pop-ups.
   - Errors appear next to each field (role="alert" text linked with
     aria-describedby), plus a summary at the top with links to each field.
   - On success the form is replaced with a confirmation message (DOM update,
     no reload). */
(function () {
  'use strict';

  var form = document.getElementById('estimate-form');
  if (!form) return;

  var summary      = document.getElementById('error-summary');
  var summaryList  = document.getElementById('error-summary-list');
  var confirmation = document.getElementById('confirmation');
  var confirmText  = document.getElementById('confirmation-text');

  // One rule per field: returns an error string, or '' when the value is OK.
  var rules = {
    name: function (v) {
      if (!v.trim()) return 'Enter your full name.';
      if (v.trim().length < 2) return 'Your name must be at least 2 characters.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) {
        return 'Enter an email address like name@example.com.';
      }
      return '';
    },
    phone: function (v) {
      // Optional, but must look like a phone number if filled in.
      if (v.trim() && v.replace(/\D/g, '').length < 10) {
        return 'Enter a phone number with at least 10 digits, or leave it blank.';
      }
      return '';
    },
    equipment: function (v) {
      return v ? '' : 'Choose the type of equipment.';
    },
    message: function (v) {
      if (!v.trim()) return 'Describe the problem.';
      if (v.trim().length < 10) return 'Please give a little more detail (at least 10 characters).';
      return '';
    }
  };

  // Show or clear the error under one field. Returns true when the field is valid.
  function validateField(name) {
    var field = form.elements[name];
    var error = rules[name](field.value);
    var msg   = document.getElementById(name + '-error');

    if (error) {
      if (!msg) {
        msg = document.createElement('p');
        msg.id = name + '-error';
        msg.className = 'error-message';
        msg.setAttribute('role', 'alert');
        field.parentNode.appendChild(msg);
      }
      msg.textContent = error;
      field.classList.add('has-error');
      field.setAttribute('aria-invalid', 'true');
      addDescribedBy(field, msg.id);
      return false;
    }

    if (msg) msg.remove();
    field.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
    removeDescribedBy(field, name + '-error');
    return true;
  }

  function addDescribedBy(field, id) {
    var ids = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (ids.indexOf(id) === -1) ids.push(id);
    field.setAttribute('aria-describedby', ids.join(' '));
  }

  function removeDescribedBy(field, id) {
    var ids = (field.getAttribute('aria-describedby') || '').split(' ')
      .filter(function (x) { return x && x !== id; });
    if (ids.length) field.setAttribute('aria-describedby', ids.join(' '));
    else field.removeAttribute('aria-describedby');
  }

  // Check every field, build the summary list, and return the invalid field names.
  function validateAll() {
    var invalid = Object.keys(rules).filter(function (name) { return !validateField(name); });

    summaryList.innerHTML = '';
    invalid.forEach(function (name) {
      var li = document.createElement('li');
      var a  = document.createElement('a');
      a.href = '#' + name;
      a.textContent = document.getElementById(name + '-error').textContent;
      a.addEventListener('click', function (e) {   // focus the field directly
        e.preventDefault();
        form.elements[name].focus();
      });
      li.appendChild(a);
      summaryList.appendChild(li);
    });
    summary.hidden = invalid.length === 0;
    return invalid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var invalid = validateAll();

    if (invalid.length) {
      summary.focus();         // move focus so screen readers read the summary
      return;
    }

    // Success: swap the form for a confirmation using the entered name.
    var first = form.elements.name.value.trim().split(' ')[0];
    var how   = form.elements['contact-method'].value;
    confirmText.textContent = 'Thanks, ' + first + '! We received your request and will contact you by ' +
      how + ' within one business day.';
    form.hidden = true;
    summary.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  // Validate each field when the user leaves it, and re-check as they fix it.
  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener('blur', function () { validateField(name); });
    field.addEventListener('input', function () {
      if (field.classList.contains('has-error')) validateField(name);
    });
  });

  // Live character count for the message box (more DOM updating).
  var message = form.elements.message;
  var count   = document.getElementById('message-count');
  if (message && count) {
    var update = function () { count.textContent = message.value.length + ' characters'; };
    message.addEventListener('input', update);
    update();
  }

  // "Send another request" resets the page state.
  var again = document.getElementById('send-another');
  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      if (count) count.textContent = '0 characters';
      confirmation.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }
})();
