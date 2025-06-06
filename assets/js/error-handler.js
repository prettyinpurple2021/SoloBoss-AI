/**
 * Global Error Handler for SoloBoss AI
 * Catches and handles errors gracefully
 */

class ErrorHandler {
    constructor() {
        this.setupGlobalHandlers();
        this.errorLog = [];
    }

    setupGlobalHandlers() {
        // Catch JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || 'Unknown promise rejection',
                stack: event.reason?.stack
            });
        });

        // Catch network errors
        window.addEventListener('offline', () => {
            this.showUserFriendlyMessage('You\'re offline! Some features may not work.', 'warning');
        });

        window.addEventListener('online', () => {
            this.showUserFriendlyMessage('You\'re back online!', 'success');
        });
    }

    handleError(errorInfo) {
        // Log error for debugging
        console.error('SoloBoss AI Error:', errorInfo);
        this.errorLog.push({
            ...errorInfo,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        });

        // Show user-friendly message
        this.showUserFriendlyMessage(
            'Oops! Something went wrong. Our AI crew is on it! 🤖',
            'error'
        );

        // Store error for later analysis
        this.storeError(errorInfo);
    }

    showUserFriendlyMessage(message, type = 'info') {
        if (window.SoloBossApp && window.SoloBossApp.showAlert) {
            window.SoloBossApp.showAlert(message, type);
        } else {
            // Fallback alert
            const alertDiv = document.createElement('div');
            alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
                type === 'error' ? 'bg-red-500' : 
                type === 'warning' ? 'bg-yellow-500' : 
                type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            } text-white`;
            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }

    storeError(errorInfo) {
        try {
            const errors = JSON.parse(localStorage.getItem('soloboss_errors') || '[]');
            errors.push(errorInfo);
            
            // Keep only last 50 errors
            if (errors.length > 50) {
                errors.splice(0, errors.length - 50);
            }
            
            localStorage.setItem('soloboss_errors', JSON.stringify(errors));
        } catch (e) {
            console.warn('Could not store error:', e);
        }
    }

    getErrorLog() {
        return this.errorLog;
    }

    clearErrorLog() {
        this.errorLog = [];
        localStorage.removeItem('soloboss_errors');
    }
}

// Initialize error handler
window.SoloBossErrorHandler = new ErrorHandler();

export default ErrorHandler;