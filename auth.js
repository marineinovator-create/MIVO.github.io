// auth.js - Functionality untuk autentikasi (login & signup)

class AuthSystem {
    constructor() {
        this.adminIds = this.generateAdminIds();
        this.init();
    }

    init() {
        this.setupLoginForm();
        this.setupSignupForm();
        this.setupPasswordToggles();
        this.setupPasswordStrength();
        this.checkExistingAuth();
    }

    generateAdminIds() {
        return Array.from({ length: 20 }, (_, i) => `admin${String(i + 1).padStart(2, '0')}`);
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Demo account quick fill
        this.setupDemoAccounts();
    }

    setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });
    }

    setupPasswordToggles() {
        // Login page toggle
        const loginToggle = document.getElementById('passwordToggle');
        if (loginToggle) {
            loginToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('loginPassword', loginToggle);
            });
        }

        // Signup page toggles
        const signupToggle = document.getElementById('signupPasswordToggle');
        const confirmToggle = document.getElementById('confirmPasswordToggle');

        if (signupToggle) {
            signupToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('signupPassword', signupToggle);
            });
        }

        if (confirmToggle) {
            confirmToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('confirmPassword', confirmToggle);
            });
        }
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', () => {
            this.updatePasswordStrength(passwordInput.value);
        });
    }

    togglePasswordVisibility(inputId, toggleBtn) {
        const input = document.getElementById(inputId);
        const toggleIcon = toggleBtn.querySelector('.toggle-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            toggleIcon.textContent = '🙈';
        } else {
            input.type = 'password';
            toggleIcon.textContent = '👁️';
        }
    }

    updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let text = 'Sangat Lemah';
        let className = 'weak';

        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
        if (password.match(/\d/)) strength += 1;
        if (password.match(/[^a-zA-Z\d]/)) strength += 1;

        switch (strength) {
            case 1:
                text = 'Lemah';
                className = 'weak';
                break;
            case 2:
                text = 'Cukup';
                className = 'medium';
                break;
            case 3:
                text = 'Kuat';
                className = 'strong';
                break;
            case 4:
                text = 'Sangat Kuat';
                className = 'strong';
                break;
        }

        strengthFill.className = `strength-fill ${className}`;
        strengthText.textContent = text;
    }

    async handleLogin() {
        const loginBtn = document.getElementById('loginBtn');
        const userId = document.getElementById('loginId').value.trim().toLowerCase();
        
        this.setButtonLoading(loginBtn, true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const user = this.authenticateUser(userId);
            
            if (user) {
                this.loginSuccess(user);
            } else {
                this.loginFailed(userId);
            }
        } catch (error) {
            this.showNotification('Terjadi kesalahan saat login', 'error');
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    async handleSignup() {
        const signupBtn = document.getElementById('signupBtn');
        const formData = this.getSignupFormData();

        if (!this.validateSignupForm(formData)) {
            return;
        }

        this.setButtonLoading(signupBtn, true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = this.registerUser(formData);
            
            if (result.success) {
                this.signupSuccess(formData);
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            this.showNotification('Terjadi kesalahan saat pendaftaran', 'error');
        } finally {
            this.setButtonLoading(signupBtn, false);
        }
    }

    getSignupFormData() {
        return {
            userId: document.getElementById('signupId').value.trim().toLowerCase(),
            fullName: document.getElementById('signupName').value.trim(),
            email: document.getElementById('signupEmail').value.trim(),
            phone: document.getElementById('signupPhone').value.trim(),
            role: document.getElementById('signupRole').value,
            password: document.getElementById('signupPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked,
            newsletter: document.getElementById('newsletter').checked
        };
    }

    validateSignupForm(data) {
        // Clear previous errors
        this.clearFormErrors();

        let isValid = true;

        // User ID validation
        if (!data.userId) {
            this.showFieldError('signupId', 'ID Pengguna wajib diisi');
            isValid = false;
        } else if (data.userId.length < 3) {
            this.showFieldError('signupId', 'ID Pengguna minimal 3 karakter');
            isValid = false;
        } else if (this.isUserIdExists(data.userId)) {
            this.showFieldError('signupId', 'ID Pengguna sudah digunakan');
            isValid = false;
        }

        // Full name validation
        if (!data.fullName) {
            this.showFieldError('signupName', 'Nama lengkap wajib diisi');
            isValid = false;
        }

        // Email validation
        if (!data.email) {
            this.showFieldError('signupEmail', 'Email wajib diisi');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showFieldError('signupEmail', 'Format email tidak valid');
            isValid = false;
        }

        // Role validation
        if (!data.role) {
            this.showFieldError('signupRole', 'Pilih peran Anda');
            isValid = false;
        }

        // Password validation
        if (!data.password) {
            this.showFieldError('signupPassword', 'Kata sandi wajib diisi');
            isValid = false;
        } else if (data.password.length < 6) {
            this.showFieldError('signupPassword', 'Kata sandi minimal 6 karakter');
            isValid = false;
        }

        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            this.showFieldError('confirmPassword', 'Konfirmasi kata sandi tidak cocok');
            isValid = false;
        }

        // Terms agreement validation
        if (!data.agreeTerms) {
            this.showFieldError('agreeTerms', 'Anda harus menyetujui syarat dan ketentuan');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = 'var(--danger)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
    }

    clearFormErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => element.remove());
        
        const errorGroups = document.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => group.classList.remove('error'));
    }

    isUserIdExists(userId) {
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        return !!users[userId] || this.adminIds.includes(userId);
    }

    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    authenticateUser(userId) {
        // Check admin accounts
        if (this.adminIds.includes(userId)) {
            return {
                id: userId,
                name: `Administrator ${userId.slice(-2)}`,
                role: 'Admin',
                isAdmin: true
            };
        }

        // Check registered users
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        return users[userId];
    }

    registerUser(userData) {
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
        
        if (users[userData.userId]) {
            return { success: false, message: 'ID Pengguna sudah digunakan' };
        }

        // Create user object
        const newUser = {
            id: userData.userId,
            name: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            joinDate: new Date().toISOString(),
            newsletter: userData.newsletter
        };

        // Save to localStorage
        users[userData.userId] = newUser;
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        return { success: true, user: newUser };
    }

    loginSuccess(user) {
        // Save session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('loginTime', new Date().toISOString());

        this.showNotification(`Selamat datang, ${user.name}!`, 'success');

        // Redirect based on role
        setTimeout(() => {
            if (user.role === 'Admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'profil.html';
            }
        }, 1500);
    }

    loginFailed(userId) {
        this.showNotification('ID Pengguna tidak ditemukan', 'error');
        
        // Offer to redirect to signup
        setTimeout(() => {
            if (confirm('ID tidak ditemukan. Mau daftar akun baru?')) {
                window.location.href = 'signup.html';
            }
        }, 1000);
    }

    signupSuccess(userData) {
        this.showNotification('Pendaftaran berhasil! Silakan login.', 'success');

        // Auto login after signup
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    setButtonLoading(button, loading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (loading) {
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
            button.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            button.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Di method loginSuccess(), tambahkan ini:
loginSuccess(user) {
    // ... kode existing ...
    
    // Trigger auth state change
    window.dispatchEvent(new Event('authStateChange'));
}

// Di method logout(), tambahkan ini:
logout() {
    // ... kode existing ...
    
    // Trigger auth state change  
    window.dispatchEvent(new Event('authStateChange'));
}
    setupDemoAccounts() {
        // Add quick demo buttons for testing
        const demoContainer = document.createElement('div');
        demoContainer.className = 'demo-quick-login';
        demoContainer.innerHTML = `
            <div style="margin-top: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 8px;">
                <p style="margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600;">Login Cepat (Demo):</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="btn btn-sm btn-outline" onclick="authSystem.quickLogin('admin01')">Admin</button>
                    <button type="button" class="btn btn-sm btn-outline" onclick="authSystem.quickLogin('pengguna01')">Pengguna</button>
                </div>
            </div>
        `;

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.appendChild(demoContainer);
        }
    }

    quickLogin(userId) {
        document.getElementById('loginId').value = userId;
        document.getElementById('loginPassword').value = 'demo123';
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }

    checkExistingAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn && (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html'))) {
            const userName = localStorage.getItem('userName');
            if (confirm(`Anda sudah login sebagai ${userName}. Mau lanjut ke dashboard?`)) {
                window.location.href = 'profil.html';
            }
        }
    }
}



// Initialize auth system
const authSystem = new AuthSystem();