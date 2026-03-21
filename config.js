/**
 * Octavian AI Configuration
 * 
 * This file contains configuration options for the Octavian AI Assistant.
 * Modify these settings to customize the behavior and appearance of your instance.
 */

// API Configuration
const OCTAVIAN_CONFIG = {
  // Application Settings
  app: {
    name: 'Octavian',
    version: '1.0.0',
    description: 'Your Intelligent AI Assistant',
    defaultAgent: 'general'
  },

  // Theme Configuration
  themes: {
    'blue-green': {
      name: 'Blue & Green (Default)',
      primaryBlue: '#2563eb',
      primaryGreen: '#10b981',
      bgDark: '#0f172a',
      bgCard: '#1e293b',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      borderColor: '#334155'
    },
    'dark': {
      name: 'Dark Mode',
      primaryBlue: '#1e40af',
      primaryGreen: '#047857',
      bgDark: '#111827',
      bgCard: '#1f2937',
      textPrimary: '#f3f4f6',
      textSecondary: '#9ca3af',
      borderColor: '#374151'
    },
    'light': {
      name: 'Light Mode',
      primaryBlue: '#3b82f6',
      primaryGreen: '#059669',
      bgDark: '#f9fafb',
      bgCard: '#ffffff',
      textPrimary: '#1f2937',
      textSecondary: '#6b7280',
      borderColor: '#d1d5db'
    }
  },

  // Default Location for Weather
  defaultLocation: 'New York',

  // Widget Refresh Interval (in milliseconds)
  widgetRefreshInterval: 300000, // 5 minutes

  // API Keys (Optional - for real API integration)
  apis: {
    googleSearch: '', // TODO: Add your Google Custom Search API key
    bingSearch: '', // TODO: Add your Bing Search API key
    openWeatherMap: '', // TODO: Add your OpenWeatherMap API key
    alphaVantage: '', // TODO: Add your Alpha Vantage API key
    newsAPI: '', // TODO: Add your NewsAPI key
    unsplash: '', // TODO: Add your Unsplash API key
    pixabay: '', // TODO: Add your Pixabay API key
    twitter: '', // TODO: Add your Twitter API keys
    instagram: '', // TODO: Add your Instagram API keys
  },

  // Mock Data Settings (for demo)
  useMockData: true, // Set to false when using real APIs
  mockDataDelay: 1000, // Delay in ms to simulate API latency

  // Feature Flags
  features: {
    webSearch: true,
    imageSearch: true,
    weatherWidget: true,
    stocksWidget: true,
    newsWidget: true,
    socialWidget: true,
    voiceInput: false, // Coming soon
    voiceOutput: false, // Coming soon
    conversationHistory: true,
    darkMode: true,
    lightMode: true,
    multiLanguage: false // Coming soon
  },

  // Chat Settings
  chat: {
    maxMessages: 1000, // Maximum messages to keep in history
    typingIndicatorDelay: 1500, // How long the typing indicator shows
    messageAnimationDuration: 300, // Animation duration in ms
    autoScroll: true, // Automatically scroll to latest message
  },

  // Widget Settings
  widgets: {
    weather: {
      unit: 'F', // F for Fahrenheit, C for Celsius
      showForecast: true,
      forecastDays: 5
    },
    stocks: {
      symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
      updateFrequency: 300000, // 5 minutes
      currency: 'USD'
    },
    news: {
      sources: ['TechNews', 'Finance Daily', 'World News', 'Science Daily'],
      language: 'en',
      country: 'us',
      maxArticles: 5
    }
  },

  // Personality Customization
  personalities: {
    // Greeting messages for each agent
    greetings: {
      general: "Hello! I'm your General Assistant. How can I help you today?",
      coding: "Ready to code! What programming challenge can I help you with?",
      researcher: "Let's dive into some research! What topic interests you?",
      writer: "Let's create something amazing! What would you like to write?",
      news: "Breaking news and updates coming your way! What's on your mind?",
      weather: "Weather update coming right up! Where are you located?",
      stocks: "Market overview loading! What stocks interest you?",
      entertainment: "Entertainment recommendations coming up! What do you like?"
    },

    // Custom response patterns (regex-based)
    responsePatterns: {
      coding: [
        { pattern: /javascript|js|node/i, context: 'JavaScript' },
        { pattern: /python|py/i, context: 'Python' },
        { pattern: /java/i, context: 'Java' },
        { pattern: /c\+\+|cpp/i, context: 'C++' }
      ],
      weather: [
        { pattern: /weather|forecast|temperature|rain|snow/i, context: 'weather_query' },
        { pattern: /cloudy|sunny|rainy|stormy/i, context: 'condition_query' }
      ]
    }
  },

  // Storage Settings
  storage: {
    useLocalStorage: true,
    storageKeys: {
      settings: 'octavian_settings',
      onboarding: 'octavian_onboarding',
      chatHistory: 'octavian_chat_history',
      theme: 'octavian_theme',
      apiKey: 'octavian_api_key',
      location: 'octavian_location'
    }
  },

  // Logging & Debug
  debug: {
    enabled: false, // Set to true for console logs
    logMessages: false, // Log all messages to console
    logAPI: false, // Log API responses
    logStorage: false // Log storage operations
  },

  // Accessibility
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false
  }
};

/**
 * Helper function to get configuration value
 * Usage: getConfig('app.name')
 */
function getConfig(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], OCTAVIAN_CONFIG);
}

/**
 * Helper function to update configuration
 * Usage: setConfig('themes.custom', { ... })
 */
function setConfig(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const obj = keys.reduce((curr, key) => curr[key] = curr[key] || {}, OCTAVIAN_CONFIG);
  obj[lastKey] = value;
}

/**
 * Export for module systems (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OCTAVIAN_CONFIG;
}
