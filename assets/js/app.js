/**
 * SoloBoss AI - Global Application Utilities
 * Shared functions and utilities for enhanced productivity and functionality
 */

// Global App State Management
const SoloBossApp = {
    user: {
        isLoggedIn: false,
        email: null,
        preferences: {}
    },
    
    // Initialize the application
    init() {
        this.checkAuthState();
        this.initializeEventListeners();
        this.loadUserPreferences();
        this.initializeTooltips();
    },

    // Authentication Management
    checkAuthState() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userEmail = sessionStorage.getItem('userEmail');
        
        this.user.isLoggedIn = !!isLoggedIn;
        this.user.email = userEmail;
        
        // Redirect to login if not authenticated and not on public pages
        const publicPages = ['index.html', 'login.html', 'signup.html', 'about_soloboss.html', 'pricing.html', 'legal.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!this.user.isLoggedIn && !publicPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    },

    // Session Management
    login(email) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        this.user.isLoggedIn = true;
        this.user.email = email;
    },

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.user.isLoggedIn = false;
        this.user.email = null;
        window.location.href = 'login.html';
    },

    // User Preferences
    loadUserPreferences() {
        const preferences = localStorage.getItem('soloboss_preferences');
        if (preferences) {
            this.user.preferences = JSON.parse(preferences);
        } else {
            this.user.preferences = {
                theme: 'dark',
                notifications: true,
                autoSave: true,
                animationsEnabled: true
            };
        }
    },

    saveUserPreferences() {
        localStorage.setItem('soloboss_preferences', JSON.stringify(this.user.preferences));
    },

    // Global Event Listeners
    initializeEventListeners() {
        // Handle logout links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href="login.html"]') || e.target.closest('a[href="login.html"]')) {
                e.preventDefault();
                this.logout();
            }
        });

        // Handle mobile menu toggles
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Auto-save functionality for forms
        if (this.user.preferences.autoSave) {
            this.initializeAutoSave();
        }
    },

    // Auto-save functionality
    initializeAutoSave() {
        const forms = document.querySelectorAll('form[data-autosave]');
        forms.forEach(form => {
            const formId = form.id || 'unnamed-form';
            
            // Load saved data
            const savedData = localStorage.getItem(`autosave_${formId}`);
            if (savedData) {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && input.type !== 'password') {
                        input.value = data[key];
                    }
                });
            }

            // Save on input
            form.addEventListener('input', this.debounce(() => {
                const formData = new FormData(form);
                const data = {};
                for (let [key, value] of formData.entries()) {
                    if (key !== 'password' && key !== 'confirmPassword') {
                        data[key] = value;
                    }
                }
                localStorage.setItem(`autosave_${formId}`, JSON.stringify(data));
            }, 1000));
        });
    },

    // Utility Functions
    debounce(func, wait) {
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

    // Enhanced Alert System
    showAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alertContainer') || this.createAlertContainer();
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.innerHTML = `
            <span class="alert-icon">${this.getAlertIcon(type)}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        alertContainer.appendChild(alertElement);
        
        // Force reflow and show
        alertElement.offsetHeight;
        alertElement.classList.add('show');
        
        // Auto-remove
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.classList.remove('show');
                setTimeout(() => alertElement.remove(), 300);
            }
        }, duration);
    },

    createAlertContainer() {
        const container = document.createElement('div');
        container.id = 'alertContainer';
        container.className = 'fixed top-4 right-4 z-50 space-y-2 max-w-sm';
        document.body.appendChild(container);
        return container;
    },

    getAlertIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    },

    // Tooltip System
    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    },

    showTooltip(e) {
        const element = e.target;
        const text = element.getAttribute('data-tooltip');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-popup';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        element._tooltip = tooltip;
    },

    hideTooltip(e) {
        const element = e.target;
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    },

    // Data Export Utilities
    exportToJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    },

    exportToCSV(data, filename) {
        if (!Array.isArray(data) || data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadBlob(blob, filename);
    },

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Local Storage Utilities
    saveToStorage(key, data) {
        try {
            localStorage.setItem(`soloboss_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to storage:', error);
            return false;
        }
    },

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`soloboss_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load from storage:', error);
            return null;
        }
    },

    // Form Validation Utilities
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePassword(password) {
        return password.length >= 8 && 
               /[0-9]/.test(password) && 
               /[a-z]/.test(password) && 
               /[A-Z]/.test(password);
    },

    // AI Agent Simulation
    simulateAIResponse(prompt, agentType = 'general') {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                const responses = this.getAIResponses(agentType);
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                resolve(randomResponse);
            }, 1000 + Math.random() * 2000);
        });
    },

    getAIResponses(agentType) {
        const responses = {
            vox: [
                "I've organized your tasks by priority. Let's tackle the high-impact items first!",
                "Based on your schedule, I recommend blocking 2-hour focus sessions for deep work.",
                "Your calendar looks packed! I've identified 3 meetings that could be emails instead."
            ],
            lexi: [
                "This strategy has strong potential! Let's validate it with your target market first.",
                "I see an opportunity to differentiate from competitors in the premium segment.",
                "Your business model needs one key adjustment to maximize profitability."
            ],
            roxie: [
                "This color palette perfectly captures your brand's rebellious energy!",
                "I've created 3 design variations that will make your audience stop scrolling.",
                "Your visual identity needs more contrast to stand out in the digital space."
            ],
            quinn: [
                "This content will absolutely crush it on social media! Here's why...",
                "I've crafted 5 variations of this message to test with different audiences.",
                "Your brand voice is getting stronger! Let's amplify the sass factor."
            ],
            vex: [
                "I recommend a microservices architecture for scalability and maintainability.",
                "This tech stack will handle your projected user growth efficiently.",
                "I've identified 3 potential security vulnerabilities we should address."
            ],
            lumi: [
                "Your terms of service need updates to comply with recent regulations.",
                "I've drafted the privacy policy sections you'll need for GDPR compliance.",
                "This contract template will protect your interests while staying founder-friendly."
            ]
        };
        
        return responses[agentType] || responses.general || ["I'm here to help you succeed!"];
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SoloBossApp.init();
});

// Make globally available
window.SoloBossApp = SoloBossApp; 