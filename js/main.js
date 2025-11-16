// main.js - Core functionality untuk MIVO

class MIVOApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAuthUI();
        this.initializeComponents();
    }

    setupEventListeners() {
        // Navigation active state
        this.setupNavigation();
        
        // Form handling
        this.setupForms();
        
        // Interactive elements
        this.setupInteractions();
    }

    setupNavigation() {
        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupForms() {
        // Contact form enhancement
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    }

    setupInteractions() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Lazy loading images
        this.setupLazyLoading();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    updateAuthUI() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userName = localStorage.getItem('userName');
        
        // Update login button text if user is logged in
        const loginBtn = document.querySelector('.auth-actions .btn-primary');
        if (loginBtn && isLoggedIn) {
            loginBtn.textContent = userName || 'Profil';
            loginBtn.href = 'profil.html';
        }
    }

    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        this.showNotification('Pesan berhasil dikirim!', 'success');
        e.target.reset();
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        // Implement search functionality as needed
        console.log('Search query:', query);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { border-left: 4px solid #2e7d32; }
                .notification-error { border-left: 4px solid #e53935; }
                .notification-info { border-left: 4px solid #00b4d8; }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    initializeComponents() {
        // Initialize any additional components
        console.log('MIVO App initialized');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mivoApp = new MIVOApp();
});

// Utility functions
const MIVOUtils = {
    // Format number with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Get user data from localStorage
    getUserData: () => {
        return {
            isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
            userName: localStorage.getItem('userName'),
            userRole: localStorage.getItem('userRole'),
            userId: localStorage.getItem('userId')
        };
    },

    // Check if user is admin
    isAdmin: () => {
        const adminIds = [
            "admin01","admin02","admin03","admin04","admin05",
            "admin06","admin07","admin08","admin09","admin10",
            "admin11","admin12","admin13","admin14","admin15",
            "admin16","admin17","admin18","admin19","admin20"
        ];
        const userId = localStorage.getItem('userId');
        return adminIds.includes(userId);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MIVOApp, MIVOUtils };
}
