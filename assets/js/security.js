/**
 * Security Enhancements for SoloBoss AI
 * Protects user data and prevents common attacks
 */

class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSRFProtection();
        this.setupInputSanitization();
        this.setupSecureStorage();
        this.setupContentSecurityPolicy();
    }

    setupCSRFProtection() {
        // Generate CSRF token for session
        this.csrfToken = this.generateToken();
        sessionStorage.setItem('csrf_token', this.csrfToken);
    }

    generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    setupInputSanitization() {
        // Sanitize all form inputs
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.sanitizeInput(e.target);
            }
        });
    }

    sanitizeInput(input) {
        // Remove potentially dangerous characters
        const dangerous = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        const cleaned = input.value.replace(dangerous, '');
        
        if (cleaned !== input.value) {
            input.value = cleaned;
            this.showSecurityWarning('Potentially unsafe content was removed from your input.');
        }
    }

    setupSecureStorage() {
        // Encrypt sensitive data before storing
        this.originalSetItem = localStorage.setItem.bind(localStorage);
        this.originalGetItem = localStorage.getItem.bind(localStorage);

        localStorage.setItem = (key, value) => {
            if (this.isSensitiveKey(key)) {
                value = this.encryptData(value);
            }
            return this.originalSetItem(key, value);
        };

        localStorage.getItem = (key) => {
            let value = this.originalGetItem(key);
            if (value && this.isSensitiveKey(key)) {
                value = this.decryptData(value);
            }
            return value;
        };
    }

    isSensitiveKey(key) {
        const sensitiveKeys = ['soloboss_users', 'soloboss_agent_', 'soloboss_preferences'];
        return sensitiveKeys.some(sensitive => key.includes(sensitive));
    }

    encryptData(data) {
        // Simple encryption for demo - in production use proper encryption
        try {
            const encoded = btoa(encodeURIComponent(data));
            return `encrypted_${encoded}`;
        } catch (e) {
            console.warn('Encryption failed:', e);
            return data;
        }
    }

    decryptData(data) {
        // Simple decryption for demo
        try {
            if (data.startsWith('encrypted_')) {
                const encoded = data.replace('encrypted_', '');
                return decodeURIComponent(atob(encoded));
            }
            return data;
        } catch (e) {
            console.warn('Decryption failed:', e);
            return data;
        }
    }

    setupContentSecurityPolicy() {
        // Add CSP meta tag if not present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const csp = document.createElement('meta');
            csp.setAttribute('http-equiv', 'Content-Security-Policy');
            csp.setAttribute('content', 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' https://us-central1-soloboss-ai-fun.cloudfunctions.net;"
            );
            document.head.appendChild(csp);
        }
    }

    validateSession() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userEmail = sessionStorage.getItem('userEmail');
        const csrfToken = sessionStorage.getItem('csrf_token');

        if (isLoggedIn && (!userEmail || !csrfToken)) {
            this.showSecurityWarning('Session validation failed. Please log in again.');
            this.clearSession();
            return false;
        }

        return true;
    }

    clearSession() {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }

    showSecurityWarning(message) {
        if (window.SoloBossApp && window.SoloBossApp.showAlert) {
            window.SoloBossApp.showAlert(`🔒 Security: ${message}`, 'warning');
        }
    }

    // Rate limiting for API calls
    rateLimiter = new Map();

    checkRateLimit(action, limit = 10, window = 60000) { // 10 requests per minute
        const now = Date.now();
        const key = `${action}_${sessionStorage.getItem('userEmail')}`;
        
        if (!this.rateLimiter.has(key)) {
            this.rateLimiter.set(key, []);
        }

        const requests = this.rateLimiter.get(key);
        
        // Remove old requests outside the window
        const validRequests = requests.filter(time => now - time < window);
        
        if (validRequests.length >= limit) {
            this.showSecurityWarning('Too many requests. Please wait a moment.');
            return false;
        }

        validRequests.push(now);
        this.rateLimiter.set(key, validRequests);
        return true;
    }

    // Secure password validation
    validatePassword(password) {
        const requirements = {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumbers: /\d/.test(password),
            hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            noCommonPatterns: !this.isCommonPassword(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;
        
        return {
            isValid: score >= 4,
            score: score,
            requirements: requirements,
            strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong'
        };
    }

    isCommonPassword(password) {
        const common = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
        return common.some(common => password.toLowerCase().includes(common));
    }
}

// Initialize security manager
window.SoloBossSecurity = new SecurityManager();

export default SecurityManager;