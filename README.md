# 🧠 Octavian - AI Assistant Platform

Octavian is a sophisticated AI assistant platform inspired by Perplexity, featuring multiple personalities/agents, real-time data widgets, and a beautiful blue-green themed interface.

## ✨ Features

### 🎭 Multiple AI Personalities
Octavian comes with 8 specialized AI personalities, each designed for different tasks:

1. **General Assistant** - Handles general queries and provides helpful information
2. **Code Master** - Assists with programming tasks across multiple languages
3. **Research Expert** - Helps find credible sources and analyze information
4. **Creative Writer** - Assists with writing, editing, and content creation
5. **News Correspondent** - Provides current news and breaking updates
6. **Weather Expert** - Gives weather forecasts and climate information
7. **Market Analyst** - Provides stock prices and market analysis
8. **Entertainment Guru** - Recommends movies, music, books, and entertainment

### 🎨 User Interface

- **Onboarding Page**: Beautiful welcome screen introducing Octavian and its features
- **Split Layout**: 
  - Left sidebar with agent selector and live widgets
  - Right main chat interface for conversations
- **Real-time Widgets**:
  - 🌤️ Weather - Current conditions and forecasts
  - 📈 Stocks - Market data and stock prices
  - 📰 News - Top headlines and current events
  - 📱 Social - Social media integration points
- **Responsive Design**: Works on desktop and mobile devices

### 🔍 Search & Media Features

- **Web Search Integration** - Search the internet for up-to-date information
- **Image Search** - Find and display images based on queries
- **Settings Modal** - Customize API keys, theme, and location

### ⚙️ Customization

- **Theme Selection**: Blue & Green (default), Dark Mode, Light Mode
- **Location Settings**: Set default location for weather and news
- **API Configuration**: Add custom API keys for enhanced features
- **Persistent Storage**: Settings saved to browser localStorage

## 📂 Project Structure

```
Octavian/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling (blue-green theme)
├── script.js           # Core JavaScript functionality
└── README.md           # This file
```

## 🚀 Getting Started

### 1. Installation (for GitHub)

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```
2. **(Optional) Start a simple local server**
   - Using Python:
     ```bash
     python3 -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.
   - Or using `npm` + `serve`:
     ```bash
     npm install -g serve
     serve .
     ```

You can also just open `index.html` directly in your browser by double-clicking it, but a local server is recommended for the best experience.

### 2. Initial Setup in the App

1. Click **“Get Started”** on the onboarding page.
2. Optionally open **Settings ⚙️** to set:
   - Brain key / model (any string)
   - Search key (any string)
   - Weather & News API keys (optional)
   - Theme and default location
3. Select an AI personality from the left sidebar.
4. Start chatting in the message box at the bottom.

## 💬 How to Use

### Switching Personalities
- Click any agent button in the left sidebar to switch personalities
- Each agent has unique response patterns and specializations

### Using Web & Image Search
- Click "Web Search" button to enable internet search
- Click "Images" button to enable image search
- Message Octavian with your query
- Disable search modes to return to normal chat

### Managing Settings
- Click the gear icon ⚙️ in the chat header
- Configure:
  - **Theme**: Change color scheme
  - **API Key**: Add custom API credentials
  - **Location**: Set default city for weather/news

### Chat Features
- **Suggestions**: Click suggestion buttons to auto-fill common queries
- **Clear Chat**: Remove chat history with the trash icon
- **Toggle Panel**: Collapse sidebar with the chevron button
- **Typing Indicator**: See when Octavian is composing a response

## 🎨 Design Elements

### Color Scheme
- **Primary Blue**: `#2563eb` - Main accent color
- **Primary Green**: `#10b981` - Secondary accent
- **Dark Background**: `#0f172a` - Main background
- **Card Background**: `#1e293b` - Lighter backgrounds

### Components
- **Smooth Animations**: Fade-in effects for messages
- **Pulse Animation**: Online status indicator
- **Typing Indicator**: Three-dot animation while AI thinks
- **Hover Effects**: Interactive button and card transitions

## 📱 Responsive Features

- **Desktop**: Full layout with side panel and main chat
- **Tablet**: Optimized spacing and touch-friendly buttons
- **Mobile**: Collapsible sidebar for better space usage

## 💾 Data Storage

Octavian uses browser localStorage to save:
- User settings (theme, API key, location)
- Onboarding state (whether user has seen intro)
- Theme preferences

## 🔌 Integration Points

### Mock Implementations (For Demonstration)
- Web Search - Generates realistic mock search results
- Image Search - Simulates image search with placeholder messages
- Weather API - Returns mock weather data
- Stock API - Generates random stock prices
- News API - Provides sample news headlines

### Ready for Real API Integration
The following can be easily replaced with real APIs:
- OpenWeatherMap for real weather data
- Alpha Vantage for stock prices
- NewsAPI for real news data
- Google Custom Search API for web searches
- Bing Image Search API for image results
- Twitter/Instagram APIs for social media feeds

## 🎯 Agent Personalities in Detail

### Code Master
- Language: Multiple (JavaScript, Python, Java, C++, etc.)
- Specializes in: Code examples, debugging, best practices
- Response Style: Provides code blocks with explanations

### Research Expert
- Expertise: Finding credible sources, data analysis
- Specializes in: Academic research, fact-checking, citations
- Response Style: Detailed with source references

### Creative Writer
- Focus: Content creation, storytelling, editing
- Specializes in: Essays, creative writing, grammar improvement
- Response Style: Engaging and constructive

### Weather Expert
- Provides: Current conditions, forecasts, climate insights
- Features: Location-based results from weather widget
- Response Style: Clear and informative forecasts

### Market Analyst
- Provides: Stock prices, market trends, investment insights
- Features: Real-time stock data in sidebar widget
- Response Style: Professional and analytical

### News Correspondent
- Provides: Breaking news, current events, headlines
- Features: Latest news feed in sidebar widget
- Response Style: Objective and factual

### Entertainment Guru
- Provides: Movie, music, book, and game recommendations
- Specializes in: Genre preferences, trending entertainment
- Response Style: Engaging and personalized

### General Assistant
- Universal helper for any topic
- Falls back when specialist agents are not selected
- Response Style: Friendly and helpful

## 🛠️ Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **Vanilla JavaScript** - No frameworks (lightweight and fast)
- **Font Awesome 6.4** - Icon library
- **LocalStorage API** - Persistent storage

## 📊 File Sizes

- index.html: ~10 KB
- styles.css: ~20 KB
- script.js: ~35 KB
- **Total**: ~65 KB (lightweight!)

## 🚀 Performance

- Fast load times (no heavy frameworks)
- Smooth animations using CSS transitions
- Efficient DOM manipulation
- LocalStorage caching for settings
- Mock data generation for demo purposes

## 🔐 Privacy & Security

- All data stored locally in browser
- No external API calls to third parties (in demo mode)
- Settings encrypted in localStorage
- No tracking or analytics

## 📝 Customization Guide

### Adding New Agents
Edit the `agents` object in `script.js`:
```javascript
agents: {
    customAgent: {
        name: 'Custom Agent',
        icon: 'fa-icon-name',
        description: 'Custom description',
        systemPrompt: 'Custom system prompt'
    }
}
```

### Changing Colors
Modify CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #your-color;
    --primary-green: #your-color;
}
```

### Integrating Real APIs
Replace mock functions in `script.js`:
- `performWebSearch()` - Add real Google/Bing search
- `generateMockWeather()` - Add OpenWeatherMap API
- `generateMockStocks()` - Add Alpha Vantage API
- `generateMockNews()` - Add NewsAPI integration

## 🤝 Contributing

Feel free to fork, modify, and enhance Octavian! Some ideas:
- Add more agent personalities
- Implement real API integrations
- Add voice input/output
- Create mobile app version
- Add conversation history management
- Implement user authentication

## 📄 License

This project is open-source and available for personal and commercial use.

## 🎓 Learning Resources

This project demonstrates:
- Object-Oriented JavaScript (Class-based architecture)
- DOM manipulation and event handling
- CSS Grid and Flexbox layouts
- LocalStorage API usage
- Asynchronous programming (async/await)
- Responsive design principles
- UI/UX best practices

## 🌟 Future Enhancements

### Planned Features
- 🔊 Voice input and text-to-speech
- 💾 Conversation history and export
- 👥 User authentication and profiles
- 🌍 Multiple language support
- 📊 Analytics and usage statistics
- 🎨 Custom theme creator
- 📱 Progressive Web App (PWA)
- 🤖 Machine learning integration

## 📞 Support

For questions or issues:
1. Check the code comments in each file
2. Review the customization guide
3. Examine the agent personality examples

## 🙏 Acknowledgments

Inspiration from:
- Perplexity AI
- ChatGPT
- Modern UI/UX design principles
- Web development best practices

---

**Enjoy using Octavian! 🧠✨**

Built with ❤️ using vanilla JavaScript
