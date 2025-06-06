/**
 * Accessibility Enhancements for SoloBoss AI
 * Ensures the app is usable by everyone
 */

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupColorContrastHelpers();
    }

    setupKeyboardNavigation() {
        // Skip to main content link
        this.addSkipLink();

        // Escape key handling for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeActiveModal();
            }
        });

        // Tab trapping in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabTrapping(e);
            }
        });
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-electric-pink text-white px-4 py-2 rounded z-50';
        skipLink.style.cssText = `
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.cssText = `
                position: absolute;
                left: 1rem;
                top: 1rem;
                width: auto;
                height: auto;
                overflow: visible;
                z-index: 9999;
                background-color: #FF3EA5;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                text-decoration: none;
            `;
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.cssText = `
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID if it doesn't exist
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }

    setupFocusManagement() {
        // Ensure focus is visible
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #FF3EA5 !important;
                outline-offset: 2px !important;
            }
            
            .focus-visible {
                outline: 2px solid #FF3EA5 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);

        // Focus management for dynamic content
        this.setupDynamicFocusManagement();
    }

    setupDynamicFocusManagement() {
        // When new content is added, ensure it's announced to screen readers
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.announceNewContent(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    announceNewContent(element) {
        // Add aria-live region for dynamic content announcements
        if (element.classList && element.classList.contains('alert')) {
            element.setAttribute('role', 'alert');
            element.setAttribute('aria-live', 'assertive');
        }
    }

    setupScreenReaderSupport() {
        // Add proper ARIA labels to interactive elements
        this.enhanceInteractiveElements();
        
        // Add live region for status updates
        this.createLiveRegion();
    }

    enhanceInteractiveElements() {
        // Enhance buttons without proper labels
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            if (!button.textContent.trim()) {
                const icon = button.querySelector('[class*="icon"], svg, img');
                if (icon) {
                    button.setAttribute('aria-label', 'Button');
                }
            }
        });

        // Enhance form inputs
        document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label && input.placeholder) {
                input.setAttribute('aria-label', input.placeholder);
            }
        });
    }

    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    setupColorContrastHelpers() {
        // Add high contrast mode toggle
        this.addContrastToggle();
    }

    addContrastToggle() {
        const toggle = document.createElement('button');
        toggle.textContent = 'High Contrast';
        toggle.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded text-sm z-50';
        toggle.setAttribute('aria-label', 'Toggle high contrast mode');
        
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            toggle.textContent = isHighContrast ? 'Normal Contrast' : 'High Contrast';
            
            if (isHighContrast) {
                this.applyHighContrastStyles();
            } else {
                this.removeHighContrastStyles();
            }
        });

        document.body.appendChild(toggle);
    }

    applyHighContrastStyles() {
        const style = document.createElement('style');
        style.id = 'high-contrast-styles';
        style.textContent = `
            .high-contrast {
                filter: contrast(150%) brightness(120%);
            }
            
            .high-contrast * {
                text-shadow: none !important;
                box-shadow: none !important;
            }
            
            .high-contrast a {
                text-decoration: underline !important;
            }
        `;
        document.head.appendChild(style);
    }

    removeHighContrastStyles() {
        const style = document.getElementById('high-contrast-styles');
        if (style) {
            style.remove();
        }
    }

    closeActiveModal() {
        const activeModal = document.querySelector('.modal-overlay.show, .entry-modal:not(.hidden)');
        if (activeModal) {
            const closeButton = activeModal.querySelector('[id*="close"], [class*="close"]');
            if (closeButton) {
                closeButton.click();
            }
        }
    }

    handleTabTrapping(e) {
        const activeModal = document.querySelector('.modal-overlay.show, .entry-modal:not(.hidden)');
        if (activeModal) {
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
    window.SoloBossAccessibility = new AccessibilityManager();
});

export default AccessibilityManager;