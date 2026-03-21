# 🚀 Octavian Quick Start Guide

Welcome to Octavian! Here's everything you need to know to get started in 5 minutes.

## ⚡ Quick Start (2 minutes)

1. **Open the application**
   - Double-click `index.html` in your file manager, OR
   - Open in VS Code and use "Open with Live Server", OR
   - Run: `python3 -m http.server 8000` and visit `http://localhost:8000`

2. **Click "Get Started"** on the welcome screen

3. **Start chatting!** Select an agent and type your message

## 🎭 The 8 AI Personalities

| Agent | Icon | Best For | Example Query |
|-------|------|----------|----------------|
| **General** | 👤 | Any question | "What's the capital of France?" |
| **Coding** | 💻 | Programming | "How do I reverse a string in Python?" |
| **Researcher** | 🔍 | Deep research | "Research the history of AI" |
| **Writer** | ✍️ | Writing help | "Help me write an essay about..." |
| **News** | 📰 | Current events | "What's happening in tech news?" |
| **Weather** | ⛅ | Weather info | "What's the weather tomorrow?" |
| **Stocks** | 📈 | Finance | "Show me Apple stock info" |
| **Entertainment** | 🎬 | Recommendations | "Recommend a good movie" |

## 💡 Pro Tips

### Using Web Search
1. Click the "Web Search" button in the chat input area
2. Type your query (e.g., "latest AI news")
3. Get comprehensive web search results
4. Click the button again to disable search mode

### Using Image Search
1. Click the "Images" button
2. Type what you want to find (e.g., "cute puppies")
3. Results will be displayed as an image gallery
4. Click again to disable image search

### Customizing Your Experience
- **Change Theme**: Click Settings ⚙️ → Select Blue & Green, Dark, or Light
- **Set Location**: Settings → Default Location (for weather updates)
- **Add API Key**: Settings → API Key (for enhanced features)

### Chat Tips
- **Press Shift+Enter** to create a new line in your message
- **Press Enter** to send your message
- Click **suggestion buttons** to quickly populate common queries
- Use the **trash icon** to clear chat history
- Use the **chevron button** to collapse/expand the sidebar

## 🔧 Customization

### Change Colors
Edit `styles.css` and modify these CSS variables:
```css
:root {
    --primary-blue: #2563eb;
    --primary-green: #10b981;
}
```

### Add Custom Agent
Edit `script.js` and add to the `agents` object:
```javascript
customAgent: {
    name: 'Your Agent Name',
    icon: 'fa-icon-name',
    description: 'What it does',
    systemPrompt: 'How it should behave'
}
```

### Integrate Real APIs
See `api-integration-guide.js` for examples of connecting:
- Google Search
- OpenWeatherMap
- Alpha Vantage (stocks)
- NewsAPI
- And more!

## 📱 Feature Checklist

- ✅ 8 AI Personalities
- ✅ Chat Interface with typing indicator
- ✅ Web Search (mock)
- ✅ Image Search (mock)
- ✅ Weather Widget
- ✅ Stocks Widget  
- ✅ News Widget
- ✅ Social Media Widget
- ✅ Settings Modal
- ✅ Multiple Themes
- ✅ Responsive Design
- ✅ Local Storage (saves settings)

## 🔐 Privacy

All your data stays on YOUR device:
- Settings saved in browser localStorage
- No external API calls (in demo mode)
- No tracking or analytics
- No data sent to servers

## 🚀 Next Steps

### For General Users
1. Explore different agents
2. Try web search and image search features
3. Check out the widgets on the left sidebar
4. Customize the theme in settings

### For Developers
1. Read `README.md` for full documentation
2. Check `api-integration-guide.js` for API examples
3. Review `config.js` for configuration options
4. Modify `script.js` to add custom features

## ❓ Common Questions

**Q: Can I use real APIs?**
A: Yes! See `api-integration-guide.js` for examples of integrating Google Search, OpenWeatherMap, NewsAPI, and more.

**Q: Where is my data stored?**
A: Everything stays in your browser's localStorage. It's never sent anywhere.

**Q: Can I add my own AI personality?**
A: Absolutely! Edit the `agents` object in `script.js` to add custom personalities.

**Q: What if I get an error?**
A: Check your browser's console (F12 → Console tab) for error messages. Most errors include helpful details.

**Q: Can I deploy this online?**
A: Yes! Upload all files to any web server. It's pure HTML/CSS/JavaScript—no backend needed!

**Q: How do I change the colors?**
A: Edit the CSS variables in `styles.css` at the top of the file.

## 📚 File Guide

| File | Purpose |
|------|---------|
| `index.html` | Main structure and layout |
| `styles.css` | All styling and themes |
| `script.js` | Chat logic and AI personalities |
| `config.js` | Configuration settings |
| `api-integration-guide.js` | Examples for real API integration |
| `README.md` | Complete documentation |

## 🎨 Customization Ideas

1. **Add YouTube integration** - Search and embed YouTube videos
2. **Add cryptocurrency prices** - Real-time crypto data
3. **Add translation** - Translate messages with Google Translate API
4. **Add voice input** - Use Web Speech API
5. **Add chat persistence** - Save full chat history to localStorage
6. **Add user authentication** - Multiple user profiles
7. **Add emoji support** - Better formatting with emoji
8. **Add markdown preview** - Render full markdown in messages

## 💬 Having Fun with Octavian

### Try These Queries

- **With General Agent**: "Tell me an interesting fact"
- **With Coding Agent**: "Explain closures in JavaScript"
- **With Writer Agent**: "Help me write a haiku"
- **With Weather Agent**: "What's the weather in Tokyo?"
- **With Entertainment Agent**: "Recommend a sci-fi book"
- **With News Agent**: "What's trending?"
- **With Researcher Agent**: "Research machine learning"

## 🔗 Resources

- **Font Awesome Icons**: https://fontawesome.com/icons
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **LocalStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## 🎯 Performance Tips

- **Mobile**: Use on any modern smartphone or tablet
- **Desktop**: Optimized for all screen sizes
- **Speed**: Lightweight (~65KB total)
- **Offline**: Works offline (except for web/image search)

## 📞 Need Help?

1. Check the comments in the code
2. Read `README.md` for full documentation
3. Look at `api-integration-guide.js` for API examples
4. Check browser console (F12) for error messages

---

**Enjoy using Octavian! 🧠✨**

Built with ❤️ using vanilla JavaScript

Last updated: 2026
