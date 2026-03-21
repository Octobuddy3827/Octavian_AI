/**
 * Octavian AI - API Integration Guide
 * 
 * This file demonstrates how to integrate real APIs with Octavian.
 * Follow the examples below to connect actual services.
 */

// ============================================================
// WEB SEARCH INTEGRATION
// ============================================================

/**
 * Google Custom Search API Integration
 * Get API key from: https://developers.google.com/custom-search/v1/overview
 */
async function integrateGoogleSearch(query, apiKey) {
  const cx = 'YOUR_CUSTOM_SEARCH_ENGINE_ID'; // Get from Google Custom Search
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet
    }));
  } catch (error) {
    console.error('Google Search Error:', error);
    return [];
  }
}

/**
 * Bing Search API Integration
 * Get API key from: https://www.microsoft.com/en-us/bing/apis/bing-search-api
 */
async function integrateBingSearch(query, apiKey) {
  const url = 'https://api.bing.microsoft.com/v7.0/search';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query })
    });
    
    const data = await response.json();
    return data.webPages.value.map(item => ({
      title: item.name,
      url: item.url,
      snippet: item.snippet
    }));
  } catch (error) {
    console.error('Bing Search Error:', error);
    return [];
  }
}

// ============================================================
// WEATHER INTEGRATION
// ============================================================

/**
 * OpenWeatherMap API Integration
 * Get API key from: https://openweathermap.org/api
 */
async function integrateOpenWeatherMap(city, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      location: data.name,
      country: data.sys.country,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('OpenWeatherMap Error:', error);
    return null;
  }
}

/**
 * WeatherAPI Integration
 * Get API key from: https://www.weatherapi.com
 */
async function integrateWeatherAPI(city, apiKey) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      temp: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      location: data.location.name,
      country: data.location.country,
      icon: data.current.condition.icon
    };
  } catch (error) {
    console.error('WeatherAPI Error:', error);
    return null;
  }
}

// ============================================================
// STOCK MARKET INTEGRATION
// ============================================================

/**
 * Alpha Vantage API Integration
 * Get API key from: https://www.alphavantage.co
 */
async function integrateAlphaVantage(symbol, apiKey) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']),
      timestamp: quote['07. latest trading day']
    };
  } catch (error) {
    console.error('Alpha Vantage Error:', error);
    return null;
  }
}

/**
 * IEX Cloud API Integration
 * Get API key from: https://iexcloud.io
 */
async function integrateIEXCloud(symbol, apiKey) {
  const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      symbol: data.symbol,
      price: data.latestPrice,
      change: data.change,
      changePercent: data.changePercent,
      timestamp: data.latestTime
    };
  } catch (error) {
    console.error('IEX Cloud Error:', error);
    return null;
  }
}

/**
 * Finnhub API Integration
 * Get API key from: https://finnhub.io
 */
async function integrateFinnhub(symbol, apiKey) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      symbol: symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc
    };
  } catch (error) {
    console.error('Finnhub Error:', error);
    return null;
  }
}

// ============================================================
// NEWS INTEGRATION
// ============================================================

/**
 * NewsAPI Integration
 * Get API key from: https://newsapi.org
 */
async function integrateNewsAPI(query, apiKey) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.articles.map(article => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      description: article.description,
      content: article.content
    }));
  } catch (error) {
    console.error('NewsAPI Error:', error);
    return [];
  }
}

/**
 * Guardian API Integration
 * Get API key from: https://open-platform.theguardian.com
 */
async function integrateGuardianAPI(query, apiKey) {
  const url = `https://open-platform.theguardian.com/search?q=${encodeURIComponent(query)}&api-key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.response.results.map(result => ({
      title: result.webTitle,
      url: result.webUrl,
      source: 'The Guardian',
      type: result.type,
      sectionName: result.sectionName
    }));
  } catch (error) {
    console.error('Guardian API Error:', error);
    return [];
  }
}

// ============================================================
// IMAGE SEARCH INTEGRATION
// ============================================================

/**
 * Unsplash API Integration
 * Get API key from: https://unsplash.com/developers
 */
async function integrateUnsplash(query, apiKey) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${apiKey}&per_page=20`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map(item => ({
      url: item.urls.regular,
      thumb: item.urls.thumb,
      title: item.alt_description || item.description,
      author: item.user.name,
      authorUrl: item.user.links.html
    }));
  } catch (error) {
    console.error('Unsplash Error:', error);
    return [];
  }
}

/**
 * Bing Image Search API Integration
 * Get API key from: https://www.microsoft.com/en-us/bing/apis/bing-image-search-api
 */
async function integrateBingImageSearch(query, apiKey) {
  const url = 'https://api.bing.microsoft.com/v7.0/images/search';
  
  try {
    const response = await fetch(`${url}?q=${encodeURIComponent(query)}`, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey
      }
    });
    
    const data = await response.json();
    return data.value.map(item => ({
      url: item.contentUrl,
      thumb: item.thumbnail.contentUrl,
      title: item.name,
      source: item.hostPageUrl
    }));
  } catch (error) {
    console.error('Bing Image Search Error:', error);
    return [];
  }
}

/**
 * Pixabay API Integration
 * Get API key from: https://pixabay.com/api/docs
 */
async function integratePixabay(query, apiKey) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.hits.map(item => ({
      url: item.largeImageURL,
      thumb: item.previewURL,
      title: item.tags,
      author: item.user,
      likes: item.likes,
      downloads: item.downloads
    }));
  } catch (error) {
    console.error('Pixabay Error:', error);
    return [];
  }
}

// ============================================================
// SOCIAL MEDIA INTEGRATION
// ============================================================

/**
 * Twitter API v2 Integration
 * Get API key from: https://developer.twitter.com
 */
async function integrateTwitterAPI(query, bearerToken) {
  const url = 'https://api.twitter.com/2/tweets/search/recent';
  
  try {
    const response = await fetch(`${url}?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,public_metrics`, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });
    
    const data = await response.json();
    return data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at,
      likes: tweet.public_metrics.like_count,
      retweets: tweet.public_metrics.retweet_count,
      replies: tweet.public_metrics.reply_count
    }));
  } catch (error) {
    console.error('Twitter API Error:', error);
    return [];
  }
}

/**
 * Instagram Basic Display API Integration
 * Get token from: https://developers.facebook.com
 */
async function integrateInstagramAPI(accessToken) {
  const url = `https://graph.instagram.com/v12.0/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${accessToken}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.map(item => ({
      id: item.id,
      caption: item.caption,
      mediaType: item.media_type,
      mediaUrl: item.media_url,
      timestamp: item.timestamp
    }));
  } catch (error) {
    console.error('Instagram API Error:', error);
    return [];
  }
}

// ============================================================
// INTEGRATION HELPER
// ============================================================

/**
 * Universal API Integration Manager Octavian
 * Handles API calls with error handling and caching
 */
class APIIntegrationManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 600000; // 10 minutes
  }

  /**
   * Add API integration
   */
  addIntegration(name, baseUrl, apiKey, headers = {}) {
    this.integrations = this.integrations || {};
    this.integrations[name] = {
      baseUrl,
      apiKey,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
  }

  /**
   * Make API call with caching
   */
  async callAPI(integrationName, endpoint, options = {}) {
    const cacheKey = `${integrationName}:${endpoint}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const integration = this.integrations[integrationName];
      const url = `${integration.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: integration.headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`API Integration Error (${integrationName}):`, error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache(integrationName) {
    if (integrationName) {
      const keysToDelete = Array.from(this.cache.keys()).filter(key => 
        key.startsWith(`${integrationName}:`)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}

// ============================================================
// USAGE EXAMPLES
// ============================================================

/*
// Example 1: Setting up Weather Integration
const weatherManager = new APIIntegrationManager();
weatherManager.addIntegration('weather', 'https://api.openweathermap.org/data/2.5', 'YOUR_API_KEY_HERE');

// In your chat response handler:
const weather = await weatherManager.callAPI('weather', '/weather?q=New York&units=metric');

// Example 2: Setting up Stock Integration
const stockManager = new APIIntegrationManager();
stockManager.addIntegration('stocks', 'https://api.example.com', 'YOUR_API_KEY_HERE', {
  'Authorization': 'Bearer YOUR_TOKEN'
});

const stock = await stockManager.callAPI('stocks', '/quote/AAPL');

// Example 3: Search Integration
const searchManager = new APIIntegrationManager();
searchManager.addIntegration('search', 'https://www.googleapis.com/customsearch/v1', 'YOUR_API_KEY_HERE');

const results = await searchManager.callAPI('search', '?q=JavaScript&cx=YOUR_CX');
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    integrateGoogleSearch,
    integrateBingSearch,
    integrateOpenWeatherMap,
    integrateWeatherAPI,
    integrateAlphaVantage,
    integrateIEXCloud,
    integrateFinnhub,
    integrateNewsAPI,
    integrateGuardianAPI,
    integrateUnsplash,
    integrateBingImageSearch,
    integratePixabay,
    integrateTwitterAPI,
    integrateInstagramAPI,
    APIIntegrationManager
  };
}
