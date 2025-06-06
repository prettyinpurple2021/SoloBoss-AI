/**
 * SoloBoss AI - Local Storage Manager
 * Manages data storage with localStorage for a pure client-side experience
 */

class LocalStorageManager {
  constructor() {
    this.migrationCompleted = false;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  async initialize() {
    console.log('💾 Local Storage Manager: Initialized');
    this.migrationCompleted = true;
  }

  // ======================
  // STORAGE API
  // ======================

  async saveConversation(agent, conversationData) {
    return this.saveConversationLocal(agent, conversationData);
  }

  saveConversationLocal(agent, conversationData) {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) throw new Error('User not logged in');

      const key = `soloboss_agent_${agent}_${userEmail}`;
      let history = JSON.parse(localStorage.getItem(key) || '[]');
      
      history.unshift({
        ...conversationData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      });

      // Keep only last 100 conversations per agent
      if (history.length > 100) {
        history = history.slice(0, 100);
      }

      localStorage.setItem(key, JSON.stringify(history));
      return { success: true, data: conversationData };
    } catch (error) {
      console.error('localStorage save failed:', error);
      throw error;
    }
  }

  async getConversations(agent, limit = 50) {
    return this.getConversationsLocal(agent, limit);
  }

  getConversationsLocal(agent, limit = 50) {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) return [];

      const key = `soloboss_agent_${agent}_${userEmail}`;
      const history = JSON.parse(localStorage.getItem(key) || '[]');
      
      return history.slice(0, limit).map(item => ({
        id: item.id || Date.now().toString(),
        agent: agent,
        content: item,
        timestamp: item.timestamp ? new Date(item.timestamp) : new Date()
      }));
    } catch (error) {
      console.error('localStorage fetch failed:', error);
      return [];
    }
  }

  async saveToBriefcase(item) {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) throw new Error('User not logged in');

      const key = `soloboss_briefcase_${userEmail}`;
      let briefcase = JSON.parse(localStorage.getItem(key) || '[]');
      
      const briefcaseItem = {
        id: Date.now().toString(),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userEmail
      };

      briefcase.unshift(briefcaseItem);
      
      // Keep only last 500 briefcase items
      if (briefcase.length > 500) {
        briefcase = briefcase.slice(0, 500);
      }

      localStorage.setItem(key, JSON.stringify(briefcase));
      return { success: true, id: briefcaseItem.id, data: briefcaseItem };
    } catch (error) {
      console.error('localStorage briefcase save failed:', error);
      throw error;
    }
  }

  async getBriefcaseItems(filters = {}) {
    try {
      const userEmail = sessionStorage.getItem('userEmail');
      if (!userEmail) return [];

      const key = `soloboss_briefcase_${userEmail}`;
      let briefcase = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Apply filters
      if (filters.agent) {
        briefcase = briefcase.filter(item => item.agent === filters.agent);
      }

      if (filters.limit) {
        briefcase = briefcase.slice(0, filters.limit);
      }

      return briefcase;
    } catch (error) {
      console.error('localStorage briefcase fetch failed:', error);
      return [];
    }
  }

  async savePreferences(preferences) {
    try {
      localStorage.setItem('soloboss_preferences', JSON.stringify(preferences));
      return { success: true };
    } catch (error) {
      console.error('localStorage preferences save failed:', error);
      throw error;
    }
  }

  getPreferencesLocal() {
    try {
      const preferences = localStorage.getItem('soloboss_preferences');
      return preferences ? JSON.parse(preferences) : {
        theme: 'dark',
        notifications: true,
        autoSave: true,
        animationsEnabled: true
      };
    } catch (error) {
      console.error('localStorage preferences fetch failed:', error);
      return {
        theme: 'dark',
        notifications: true,
        autoSave: true,
        animationsEnabled: true
      };
    }
  }

  // ======================
  // STATUS AND UTILITIES
  // ======================

  getStorageStatus() {
    return {
      isOnline: navigator.onLine,
      migrationCompleted: this.migrationCompleted,
      queueSize: 0 // Local storage does not have a queue
    };
  }

  // ======================
  // REAL-TIME SUBSCRIPTIONS
  // ======================

  subscribeToConversations(agent, callback) {
    // For localStorage, we can simulate with periodic checks
    return this.simulateLocalSubscription(() => {
      const conversations = this.getConversationsLocal(agent);
      callback(conversations);
    });
  }

  subscribeToBriefcase(callback) {
    // For localStorage, we can simulate with periodic checks
    return this.simulateLocalSubscription(() => {
      const items = this.getBriefcaseItemsLocal();
      callback(items);
    });
  }

  simulateLocalSubscription(callback) {
    const interval = setInterval(callback, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }
}

// Create global instance
const storageManager = new LocalStorageManager();

// Export for use in other modules
window.StorageManager = storageManager;

export default storageManager; 