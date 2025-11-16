// auth-header.js - Dynamic Header Management
class AuthHeader {
    constructor() {
        this.init();
    }

    init() {
        this.updateHeader();
        this.setupEventListeners();
    }

    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    getUserData() {
        return {
            name: localStorage.getItem('userName') || 'Pengguna',
            role: localStorage.getItem('userRole') || 'user',
            id: localStorage.getItem('userId') || ''
        };
    }

    updateHeader() {
        const authActions = document.getElementById('authActions');
        const existingUserMenu = document.querySelector('.user-menu');
        
        console.log('Update Header - Logged in:', this.isLoggedIn());
        
        if (!authActions) {
            console.log('authActions element not found');
            return;
        }

        // Hapus user menu yang sudah ada jika ada
        if (existingUserMenu) {
            existingUserMenu.remove();
        }

        if (this.isLoggedIn()) {
            const userData = this.getUserData();
            console.log('User data:', userData);
            
            // Update auth actions - show profile & logout
            authActions.innerHTML = `
                <div class="user-menu">
                    <div class="user-avatar" id="userAvatar">
                        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="${userData.name}" />
                        <span class="user-name">${userData.name}</span>
                        <div class="user-dropdown">
                            <a href="profil.html" class="dropdown-item">👤 Lihat Profil</a>
                            <a href="#" class="dropdown-item" id="logoutBtn">🚪 Logout</a>
                        </div>
                    </div>
                </div>
            `;

        } else {
            console.log('User not logged in, showing login buttons');
            // Show login/register buttons
            authActions.innerHTML = `
                <a href="signup.html" class="btn btn-outline">Daftar</a>
                <a href="login.html" class="btn btn-primary">Login</a>
            `;
        }

        this.setupUserMenu();
    }

    setupUserMenu() {
        const userAvatar = document.getElementById('userAvatar');
        const logoutBtn = document.getElementById('logoutBtn');

        if (userAvatar) {
            const dropdown = userAvatar.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
                
                userAvatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isVisible = dropdown.style.display === 'block';
                    dropdown.style.display = isVisible ? 'none' : 'block';
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!userAvatar.contains(e.target)) {
                        dropdown.style.display = 'none';
                    }
                });
            }
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    logout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Clear auth data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('adminAuthenticated');

            // Show notification
            this.showNotification('Logout berhasil!', 'success');
            
            // Update header and redirect
            setTimeout(() => {
                this.updateHeader();
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    setupEventListeners() {
        // Listen for storage changes (for multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === 'isLoggedIn') {
                this.updateHeader();
            }
        });

        // Listen for auth state changes from auth.js
        window.addEventListener('authStateChange', () => {
            this.updateHeader();
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.auth-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'auth-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize auth header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthHeader();
});
