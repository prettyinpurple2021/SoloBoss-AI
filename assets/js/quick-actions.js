/**
 * SoloBoss AI - Quick Actions Menu
 * Keyboard shortcuts and quick access to common actions
 */

class QuickActionsMenu {
    constructor() {
        this.isOpen = false;
        this.actions = [
            { key: 'h', label: 'Go to Hub', action: () => window.location.href = 'app_hub.html', icon: '🏠' },
            { key: 'v', label: 'Chat with Vox', action: () => window.location.href = 'agent_vox.html', icon: '🧠' },
            { key: 'l', label: 'Strategize with Lexi', action: () => window.location.href = 'agent_lexi.html', icon: '💡' },
            { key: 'r', label: 'Design with Roxie', action: () => window.location.href = 'agent_roxie.html', icon: '🎨' },
            { key: 'q', label: 'Market with Quinn', action: () => window.location.href = 'agent_quinn.html', icon: '📢' },
            { key: 'x', label: 'Build with Vex', action: () => window.location.href = 'agent_vex.html', icon: '/>_' },
            { key: 'm', label: 'Legal with Lumi', action: () => window.location.href = 'agent_lumi.html', icon: '⚖️' },
            { key: 'b', label: 'Open Briefcase', action: () => window.location.href = 'briefcase.html', icon: '🧰' },
            { key: 'p', label: 'View Profile', action: () => window.location.href = 'profile.html', icon: '👤' },
            { key: 's', label: 'Save Current Work', action: () => this.saveCurrentWork(), icon: '💾' },
            { key: 'e', label: 'Export Data', action: () => this.showExportOptions(), icon: '📤' },
            { key: '?', label: 'Show Help', action: () => window.location.href = 'help.html', icon: '❓' }
        ];
        
        this.init();
    }

    init() {
        this.createMenu();
        this.bindKeyboardShortcuts();
    }

    createMenu() {
        const menu = document.createElement('div');
        menu.id = 'quick-actions-menu';
        menu.className = 'fixed inset-0 bg-black/70 z-50 hidden items-center justify-center';
        menu.innerHTML = `
            <div class="bg-gray-900 border border-purple-500/30 rounded-lg p-6 max-w-md w-full mx-4 transform scale-95 transition-transform">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-header text-xl text-purple-400">Quick Actions</h3>
                    <button id="close-quick-menu" class="text-gray-400 hover:text-white">✕</button>
                </div>
                <div class="text-xs text-gray-400 mb-4">Press Ctrl+K or Cmd+K to open • ESC to close</div>
                <div class="space-y-1 max-h-64 overflow-y-auto" id="actions-list">
                    ${this.actions.map(action => `
                        <button class="quick-action-item w-full text-left p-3 rounded hover:bg-purple-500/20 transition-colors flex items-center" data-key="${action.key}">
                            <span class="text-lg mr-3">${action.icon}</span>
                            <span class="flex-1">${action.label}</span>
                            <span class="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">${action.key.toUpperCase()}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="mt-4 pt-4 border-t border-gray-700">
                    <input type="text" id="quick-search" placeholder="Search actions..." 
                           class="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none">
                </div>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Event listeners
        document.getElementById('close-quick-menu').addEventListener('click', () => this.close());
        menu.addEventListener('click', (e) => {
            if (e.target === menu) this.close();
        });
        
        // Action item clicks
        document.querySelectorAll('.quick-action-item').forEach(item => {
            item.addEventListener('click', () => {
                const key = item.dataset.key;
                const action = this.actions.find(a => a.key === key);
                if (action) {
                    action.action();
                    this.close();
                }
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('quick-search');
        searchInput.addEventListener('input', (e) => this.filterActions(e.target.value));
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const visibleActions = document.querySelectorAll('.quick-action-item:not(.hidden)');
                if (visibleActions.length > 0) {
                    visibleActions[0].click();
                }
            }
        });
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Open menu with Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.open();
                return;
            }
            
            // Close menu with Escape
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
                return;
            }
            
            // Quick actions when menu is open
            if (this.isOpen) {
                const action = this.actions.find(a => a.key === e.key.toLowerCase());
                if (action) {
                    e.preventDefault();
                    action.action();
                    this.close();
                }
            }
        });
    }

    open() {
        const menu = document.getElementById('quick-actions-menu');
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        menu.querySelector('.bg-gray-900').classList.remove('scale-95');
        menu.querySelector('.bg-gray-900').classList.add('scale-100');
        
        // Focus search input
        setTimeout(() => {
            document.getElementById('quick-search').focus();
        }, 100);
        
        this.isOpen = true;
    }

    close() {
        const menu = document.getElementById('quick-actions-menu');
        menu.querySelector('.bg-gray-900').classList.remove('scale-100');
        menu.querySelector('.bg-gray-900').classList.add('scale-95');
        
        setTimeout(() => {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
        }, 150);
        
        // Clear search
        document.getElementById('quick-search').value = '';
        this.filterActions('');
        
        this.isOpen = false;
    }

    filterActions(query) {
        const items = document.querySelectorAll('.quick-action-item');
        items.forEach(item => {
            const label = item.querySelector('span:nth-child(2)').textContent.toLowerCase();
            const matches = label.includes(query.toLowerCase());
            item.classList.toggle('hidden', !matches);
        });
    }

    saveCurrentWork() {
        // Collect form data from current page
        const forms = document.querySelectorAll('form, [data-autosave]');
        const data = {};
        
        forms.forEach(form => {
            const formData = new FormData(form);
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
        });
        
        // Also collect textarea and input values
        const inputs = document.querySelectorAll('textarea, input[type="text"], input[type="email"]');
        inputs.forEach(input => {
            if (input.value && input.id) {
                data[input.id] = input.value;
            }
        });
        
        if (Object.keys(data).length > 0) {
            const timestamp = new Date().toISOString();
            SoloBossApp.saveToStorage(`manual_save_${timestamp}`, data);
            SoloBossApp.showAlert('Work saved successfully! 💾', 'success');
        } else {
            SoloBossApp.showAlert('No data to save on this page', 'info');
        }
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.innerHTML = `
            <div class="modal-content">
                <h3 class="font-header text-xl text-purple-400 mb-4">Export Options</h3>
                <div class="space-y-3">
                    <button class="btn btn-primary w-full" onclick="this.exportProductivityData()">
                        📊 Export Productivity Data
                    </button>
                    <button class="btn btn-secondary w-full" onclick="this.exportBriefcaseData()">
                        🧰 Export Briefcase Contents
                    </button>
                    <button class="btn btn-outline w-full" onclick="this.exportAllData()">
                        📦 Export All Data
                    </button>
                </div>
                <button class="btn btn-outline mt-4" onclick="this.parentElement.parentElement.remove()">
                    Cancel
                </button>
            </div>
        `;
        
        // Add export methods to buttons
        modal.querySelector('button:nth-child(1)').onclick = () => {
            const data = SoloBossApp.loadFromStorage('productivity_metrics') || {};
            SoloBossApp.exportToJSON(data, 'soloboss-productivity-data.json');
            modal.remove();
        };
        
        modal.querySelector('button:nth-child(2)').onclick = () => {
            const data = {
                battlePlans: SoloBossApp.loadFromStorage('battle_plans') || [],
                manifestos: SoloBossApp.loadFromStorage('manifestos') || [],
                styleVault: SoloBossApp.loadFromStorage('style_vault') || []
            };
            SoloBossApp.exportToJSON(data, 'soloboss-briefcase-data.json');
            modal.remove();
        };
        
        modal.querySelector('button:nth-child(3)').onclick = () => {
            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('soloboss_')) {
                    allData[key] = JSON.parse(localStorage.getItem(key));
                }
            }
            SoloBossApp.exportToJSON(allData, 'soloboss-complete-backup.json');
            modal.remove();
        };
        
        document.body.appendChild(modal);
    }
}

// Initialize quick actions menu
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on app pages
    const isAppPage = document.querySelector('.app-shell-sidebar') || 
                     window.location.pathname.includes('app_hub') ||
                     window.location.pathname.includes('agent_') ||
                     window.location.pathname.includes('briefcase') ||
                     window.location.pathname.includes('profile');
    
    if (isAppPage) {
        window.quickActionsMenu = new QuickActionsMenu();
    }
});

// Export for global use
window.QuickActionsMenu = QuickActionsMenu; 