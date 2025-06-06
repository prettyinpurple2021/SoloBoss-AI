/**
 * SoloBoss AI - Simulated AI Integration
 * Local AI simulation for demo purposes without external dependencies
 */

class SoloBossAI {
  constructor() {
    // Simulated AI responses - no external API dependencies
    this.responseDatabase = this.initializeResponseDatabase();
  }

  initializeResponseDatabase() {
    return {
      vox: {
        keywords: ['task', 'schedule', 'organize', 'plan', 'meeting', 'deadline', 'calendar', 'productivity'],
        responses: [
          "I've analyzed your task list and identified 3 high-priority items that need immediate attention. Let me help you organize them by deadline and impact.",
          "Based on your schedule, I recommend blocking out 2-hour focus sessions for deep work. I can help you set up time-blocking strategies.",
          "Your calendar looks packed! I've identified 3 meetings that could be emails instead. Would you like me to help you optimize your schedule?",
          "Let me help you break down this project into manageable tasks with clear deadlines and milestones.",
          "I recommend implementing the Getting Things Done (GTD) methodology for your workflow. Here's how we can adapt it to your business...",
          "Your productivity would benefit from batch processing similar tasks. Let me show you how to group your activities effectively."
        ]
      },
      lexi: {
        keywords: ['strategy', 'business', 'market', 'competition', 'growth', 'revenue', 'customer', 'plan'],
        responses: [
          "This strategy has strong potential! Let's validate it with your target market first through customer interviews and MVP testing.",
          "I see an opportunity to differentiate from competitors in the premium segment. Here's how you can position yourself uniquely...",
          "Your business model needs one key adjustment to maximize profitability. Let's analyze your unit economics and pricing strategy.",
          "The market timing is excellent for this idea. I recommend starting with a niche segment before expanding broadly.",
          "Your competitive advantage lies in personal branding and customer relationships. Let's leverage that strength strategically.",
          "Consider implementing a freemium model to accelerate customer acquisition while building premium value."
        ]
      },
      roxie: {
        keywords: ['design', 'brand', 'visual', 'color', 'logo', 'website', 'creative', 'aesthetic'],
        responses: [
          "This color palette perfectly captures your brand's rebellious energy! Let's add some contrasting accents to make it pop even more.",
          "I've created 3 design variations that will make your audience stop scrolling. The bold typography really emphasizes your punk rock vibe.",
          "Your visual identity needs more contrast to stand out in the digital space. Try pairing that electric pink with deep charcoal backgrounds.",
          "The logo concept is strong, but let's refine the typography to match your brand personality better.",
          "This design aesthetic screams 'disruptor' - exactly what solo entrepreneurs need to stand out from corporate competition.",
          "Consider adding hand-drawn elements or graffiti-style accents to reinforce the underground, authentic feel of your brand."
        ]
      },
      quinn: {
        keywords: ['marketing', 'content', 'social', 'audience', 'viral', 'engagement', 'campaign', 'growth'],
        responses: [
          "This content will absolutely crush it on social media! Here's why: it taps into the frustration every entrepreneur feels but addresses it with attitude.",
          "I've crafted 5 variations of this message to test with different audience segments. Let's A/B test them across platforms.",
          "Your brand voice is getting stronger! Let's amplify the sass factor while maintaining professionalism for business contexts.",
          "This campaign idea has viral potential. Add some controversy (tastefully) and user-generated content elements.",
          "Your audience engagement will skyrocket if you share more behind-the-scenes struggles and wins. Authenticity is your superpower.",
          "Try repurposing this content across 7 different formats: video, carousel, story, reel, tweet thread, LinkedIn post, and email newsletter."
        ]
      },
      vex: {
        keywords: ['technical', 'code', 'architecture', 'database', 'API', 'security', 'performance', 'scalability'],
        responses: [
          "I recommend a microservices architecture for scalability and maintainability. Here's how to structure your services effectively...",
          "This tech stack will handle your projected user growth efficiently. Consider adding Redis for caching and improved performance.",
          "I've identified 3 potential security vulnerabilities we should address before launch. Let's implement proper authentication and data encryption.",
          "Your database schema needs optimization for better query performance. Consider indexing these frequently accessed fields.",
          "This API design follows REST best practices, but let's add proper rate limiting and error handling for production readiness.",
          "For rapid prototyping, I suggest using a NoSQL database with a REST API. You can always migrate to a more complex architecture later."
        ]
      },
      lumi: {
        keywords: ['legal', 'contract', 'terms', 'privacy', 'compliance', 'intellectual property', 'business structure'],
        responses: [
          "Your terms of service need updates to comply with recent regulations. I've drafted the key sections, but please consult a lawyer for final review.",
          "I've created a privacy policy template that covers GDPR and CCPA requirements. Remember, this is general guidance - get legal review for your specific case.",
          "This contract template will protect your interests while staying founder-friendly. Always have important contracts reviewed by a qualified attorney.",
          "Consider forming an LLC to protect your personal assets. The structure varies by state, so consult with a business attorney about your specific situation.",
          "Your intellectual property strategy should include trademark registration for your brand name and logo. I can provide general guidance, but work with an IP lawyer.",
          "⚠️ Legal Disclaimer: I provide general information only. Always consult with qualified legal professionals for specific legal advice."
        ]
      }
    };
  }

  async simulateTypingDelay() {
    // Simulate realistic AI response time
    const delay = 1000 + Math.random() * 2000; // 1-3 seconds
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  generateResponse(prompt, agentName) {
    const agent = this.responseDatabase[agentName] || this.responseDatabase.vox;
    const promptLower = prompt.toLowerCase();
    
    // Find matching responses based on keywords
    let matchingResponses = agent.responses;
    
    // Check if prompt contains any agent-specific keywords
    const hasKeywords = agent.keywords.some(keyword => promptLower.includes(keyword));
    
    if (hasKeywords) {
      // If keywords match, use agent-specific responses
      matchingResponses = agent.responses;
    } else {
      // If no keywords match, provide a generic helpful response
      matchingResponses = [
        `I'm here to help you with that! As your ${agentName.toUpperCase()} AI agent, let me think about the best approach for your situation.`,
        `That's an interesting challenge! Let me break this down and provide some actionable insights.`,
        `Great question! Based on my expertise, here are some strategies that could work well for your situation.`,
        `I love that you're thinking strategically about this! Here's how I'd approach it...`
      ];
    }
    
    // Select a random response from the matching set
    const randomIndex = Math.floor(Math.random() * matchingResponses.length);
    return matchingResponses[randomIndex];
  }

  async chatWithAgent(prompt, agentName = 'vox') {
    // Simulate network delay
    await this.simulateTypingDelay();
    
    // Generate contextual response
    const response = this.generateResponse(prompt, agentName);
    
    // Add some personality based on agent
    let styledResponse = response;
    
    switch (agentName) {
      case 'roxie':
        styledResponse += "\n\n✨ *adds some creative flair* ✨";
        break;
      case 'quinn':
        styledResponse += "\n\n🔥 Let's make this go viral! 🔥";
        break;
      case 'vex':
        styledResponse += "\n\n⚡ Code it up and ship it! ⚡";
        break;
      case 'lumi':
        styledResponse += "\n\n⚖️ Remember: This is general guidance only. Consult a lawyer for specific legal advice.";
        break;
      case 'lexi':
        styledResponse += "\n\n💼 Now let's turn this strategy into action! 💼";
        break;
      case 'vox':
        styledResponse += "\n\n📋 I'm here to keep you organized and productive! 📋";
        break;
    }
    
    return styledResponse;
  }

  // Keep the same interface for compatibility
  async callGeminiAPI(prompt) {
    return await this.chatWithAgent(prompt, 'general');
  }

  enhancePromptForAgent(prompt, agent) {
    // This method is kept for compatibility but is now handled internally
    return prompt;
  }
}

// Global instance
window.SoloBossAI = new SoloBossAI();

// Simplified setup - no API key needed for simulated responses
window.setupAI = function() {
  console.log('✅ AI simulation ready! No external API dependencies.');
}; 