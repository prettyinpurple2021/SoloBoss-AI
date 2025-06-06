/**
 * SoloBoss AI - Productivity Dashboard
 * Real-time productivity tracking and insights
 */

class ProductivityDashboard {
    constructor() {
        this.metrics = {
            tasksCompleted: 0,
            timeSpent: 0,
            agentsUsed: new Set(),
            projectsActive: 0,
            streak: this.loadStreak()
        };
        
        this.init();
    }

    init() {
        this.loadMetrics();
        this.createDashboardWidget();
        this.startTracking();
    }

    loadMetrics() {
        const saved = SoloBossApp.loadFromStorage('productivity_metrics');
        if (saved) {
            this.metrics = { ...this.metrics, ...saved };
            this.metrics.agentsUsed = new Set(saved.agentsUsed || []);
        }
    }

    saveMetrics() {
        const toSave = {
            ...this.metrics,
            agentsUsed: Array.from(this.metrics.agentsUsed)
        };
        SoloBossApp.saveToStorage('productivity_metrics', toSave);
    }

    loadStreak() {
        const lastActive = localStorage.getItem('soloboss_last_active');
        const streak = parseInt(localStorage.getItem('soloboss_streak') || '0');
        
        if (lastActive) {
            const lastDate = new Date(lastActive);
            const today = new Date();
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                return streak + 1;
            } else if (diffDays > 1) {
                return 0;
            }
        }
        
        return streak;
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = localStorage.getItem('soloboss_last_active');
        
        if (lastActive !== today) {
            localStorage.setItem('soloboss_last_active', today);
            localStorage.setItem('soloboss_streak', this.metrics.streak.toString());
        }
    }

    createDashboardWidget() {
        const widget = document.createElement('div');
        widget.id = 'productivity-widget';
        widget.className = 'fixed bottom-4 left-4 bg-gray-900 border border-purple-500/30 rounded-lg p-4 max-w-sm z-40 transition-transform transform translate-y-full';
        widget.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-header text-lg text-purple-400">Daily Progress</h3>
                <button id="toggle-widget" class="text-gray-400 hover:text-white">
                    <span class="text-sm">📊</span>
                </button>
            </div>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span>Tasks Completed:</span>
                    <span id="tasks-count" class="text-green-400">0</span>
                </div>
                <div class="flex justify-between">
                    <span>Time Active:</span>
                    <span id="time-spent" class="text-blue-400">0m</span>
                </div>
                <div class="flex justify-between">
                    <span>Agents Used:</span>
                    <span id="agents-count" class="text-pink-400">0</span>
                </div>
                <div class="flex justify-between">
                    <span>Daily Streak:</span>
                    <span id="streak-count" class="text-yellow-400">0 🔥</span>
                </div>
            </div>
            <div class="mt-3">
                <div class="progress-bar">
                    <div id="daily-progress" class="progress-fill" style="width: 0%"></div>
                </div>
                <p class="text-xs text-gray-400 mt-1">Daily Goal Progress</p>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Toggle functionality
        document.getElementById('toggle-widget').addEventListener('click', () => {
            widget.classList.toggle('translate-y-full');
        });
        
        // Show widget after a delay
        setTimeout(() => {
            widget.classList.remove('translate-y-full');
        }, 2000);
        
        this.updateWidget();
    }

    updateWidget() {
        const tasksElement = document.getElementById('tasks-count');
        const timeElement = document.getElementById('time-spent');
        const agentsElement = document.getElementById('agents-count');
        const streakElement = document.getElementById('streak-count');
        const progressElement = document.getElementById('daily-progress');
        
        if (tasksElement) tasksElement.textContent = this.metrics.tasksCompleted;
        if (timeElement) timeElement.textContent = `${Math.floor(this.metrics.timeSpent / 60)}m`;
        if (agentsElement) agentsElement.textContent = this.metrics.agentsUsed.size;
        if (streakElement) streakElement.textContent = `${this.metrics.streak} 🔥`;
        
        // Calculate daily progress (goal: 5 tasks, 2 hours, 3 agents)
        const taskProgress = Math.min(this.metrics.tasksCompleted / 5, 1);
        const timeProgress = Math.min(this.metrics.timeSpent / 120, 1);
        const agentProgress = Math.min(this.metrics.agentsUsed.size / 3, 1);
        const overallProgress = (taskProgress + timeProgress + agentProgress) / 3 * 100;
        
        if (progressElement) progressElement.style.width = `${overallProgress}%`;
    }

    trackAgentUsage(agentName) {
        this.metrics.agentsUsed.add(agentName);
        this.saveMetrics();
        this.updateWidget();
    }

    trackTaskCompletion() {
        this.metrics.tasksCompleted++;
        this.saveMetrics();
        this.updateWidget();
        
        // Show celebration for milestones
        if (this.metrics.tasksCompleted % 5 === 0) {
            SoloBossApp.showAlert(`🎉 ${this.metrics.tasksCompleted} tasks completed today!`, 'success');
        }
    }

    startTracking() {
        // Track time spent
        setInterval(() => {
            this.metrics.timeSpent++;
            if (this.metrics.timeSpent % 60 === 0) { // Every minute
                this.saveMetrics();
                this.updateWidget();
            }
        }, 1000);
        
        // Update streak
        this.updateStreak();
        
        // Track page interactions
        document.addEventListener('click', (e) => {
            // Track agent usage
            const agentLink = e.target.closest('a[href*="agent_"]');
            if (agentLink) {
                const agentName = agentLink.href.match(/agent_(\w+)/)?.[1];
                if (agentName) {
                    this.trackAgentUsage(agentName);
                }
            }
            
            // Track task completions (buttons with specific classes)
            if (e.target.matches('.btn-primary, .btn-secondary') && 
                !e.target.disabled && 
                e.target.textContent.includes('Generate')) {
                this.trackTaskCompletion();
            }
        });
    }

    getInsights() {
        const insights = [];
        
        if (this.metrics.tasksCompleted === 0) {
            insights.push("Start your productivity journey by completing your first task!");
        } else if (this.metrics.tasksCompleted >= 10) {
            insights.push("You're on fire! 🔥 Amazing productivity today!");
        }
        
        if (this.metrics.agentsUsed.size >= 3) {
            insights.push("Great job utilizing multiple AI agents for different tasks!");
        }
        
        if (this.metrics.streak >= 7) {
            insights.push(`Incredible ${this.metrics.streak}-day streak! You're building great habits!`);
        }
        
        return insights;
    }
}

// Initialize productivity dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on app pages (not landing pages)
    const isAppPage = document.querySelector('.app-shell-sidebar') || 
                     window.location.pathname.includes('app_hub') ||
                     window.location.pathname.includes('agent_') ||
                     window.location.pathname.includes('briefcase');
    
    if (isAppPage) {
        window.productivityDashboard = new ProductivityDashboard();
    }
});

// Export for global use
window.ProductivityDashboard = ProductivityDashboard; 