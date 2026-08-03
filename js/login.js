/**
 * FixMyCampus - Login Page Controller
 * Interactive logic for password toggle, role pre-fill, local storage, and authentication simulation.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Element Selectors
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const togglePasswordIcon = document.getElementById('togglePasswordIcon');
  const rememberMeCheck = document.getElementById('rememberMeCheck');
  const submitBtn = document.getElementById('submitBtn');
  const rolePills = document.querySelectorAll('.login-role-pill');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const forgotEmailInput = document.getElementById('forgotEmailInput');
  const forgotAlert = document.getElementById('forgotAlert');

  // Role Preset Credentials
  const DEMO_CREDENTIALS = {
    reporter: {
      email: 'sjenkins@campus.edu',
      password: 'StudentPass2026!',
      roleName: 'Student / Staff'
    },
    admin: {
      email: 'admin.facilities@campus.edu',
      password: 'AdminSuper2026!',
      roleName: 'Facilities Admin'
    },
    technician: {
      email: 'dmiller.tech@campus.edu',
      password: 'TechnicianPass2026!',
      roleName: 'Technician Board'
    }
  };

  // 1. Restore Remembered Email from LocalStorage
  const savedEmail = localStorage.getItem('fmc_remembered_email');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheck.checked = true;
  } else {
    // Default pre-fill reporter role
    fillRoleCredentials('reporter');
  }

  // 2. Show/Hide Password Toggle Logic
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', function () {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      if (isPassword) {
        togglePasswordIcon.classList.remove('bi-eye');
        togglePasswordIcon.classList.add('bi-eye-slash');
        togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      } else {
        togglePasswordIcon.classList.remove('bi-eye-slash');
        togglePasswordIcon.classList.add('bi-eye');
        togglePasswordBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  // 3. Role Selector Pills Switcher
  rolePills.forEach(pill => {
    pill.addEventListener('click', function () {
      rolePills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const selectedRole = this.getAttribute('data-role');
      if (selectedRole && DEMO_CREDENTIALS[selectedRole]) {
        fillRoleCredentials(selectedRole);
      }
    });
  });

  function fillRoleCredentials(roleKey) {
    const creds = DEMO_CREDENTIALS[roleKey];
    if (creds) {
      emailInput.value = creds.email;
      passwordInput.value = creds.password;
      // Store current selected role for session
      sessionStorage.setItem('fmc_active_role', roleKey);
    }
  }

  // 4. Login Form Submission & Validation
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Basic Validation
      if (!email || !password) {
        showToast('Please enter both email and password.', 'danger');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'warning');
        emailInput.focus();
        return;
      }

      // Save or clear Remember Me
      if (rememberMeCheck.checked) {
        localStorage.setItem('fmc_remembered_email', email);
      } else {
        localStorage.removeItem('fmc_remembered_email');
      }

      // Show Loading State
      setLoadingState(true);

      // Simulate Authentication API delay
      setTimeout(function () {
        setLoadingState(false);
        showToast('Authentication successful! Redirecting to dashboard...', 'success');
        
        // Save user state & redirect to main portal
        sessionStorage.setItem('fmc_logged_in_user', email);
        
        setTimeout(function () {
          window.location.href = 'index.html';
        }, 800);
      }, 1000);
    });
  }

  // 5. Forgot Password Form Submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const resetEmail = forgotEmailInput.value.trim();

      if (!resetEmail || !validateEmail(resetEmail)) {
        forgotAlert.className = 'alert alert-danger mb-3';
        forgotAlert.textContent = 'Please enter a valid campus email address.';
        forgotAlert.classList.remove('d-none');
        return;
      }

      const resetBtn = document.getElementById('sendResetBtn');
      resetBtn.disabled = true;
      resetBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

      setTimeout(function () {
        resetBtn.disabled = false;
        resetBtn.innerHTML = '<i class="bi bi-send me-1"></i>Send Reset Link';
        forgotAlert.className = 'alert alert-success mb-3';
        forgotAlert.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Password reset instructions have been sent to <strong>' + escapeHtml(resetEmail) + '</strong>.';
        forgotAlert.classList.remove('d-none');
        forgotEmailInput.value = '';
      }, 1200);
    });
  }

  // Helper Functions
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Authenticating...';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Sign In to Portal <i class="bi bi-arrow-right-short fs-5 ms-1"></i>';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showToast(message, type = 'info') {
    let container = document.getElementById('loginToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'loginToastContainer';
      container.className = 'toast-container-fmc';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning text-dark' : 'bg-primary';
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
    
    toastEl.className = `toast align-items-center text-white ${bgClass} border-0 show shadow-lg`;
    toastEl.setAttribute('role', 'alert');
    toastEl.innerHTML = `
      <div class="d-flex p-3 align-items-center">
        <i class="bi ${iconClass} fs-5 me-2"></i>
        <div class="toast-body p-0 fw-medium">
          ${escapeHtml(message)}
        </div>
        <button type="button" class="btn-close btn-close-white ms-auto me-0" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => toastEl.remove(), 300);
    }, 4000);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
