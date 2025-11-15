const axios = require('axios');
const Parser = require('rss-parser');
const { analyzeSentiment, extractKeywords, categorizeMention } = require('../utils/sentimentAnalyzer');

// Fallback dummy data
const dummyMentions = require('../utils/dummyData.json');

// Initialize RSS parser
const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail']
  }
});

/**
 * Fetch mentions from Google News RSS (FREE - No API key required)
 */
async function fetchFromGoogleNews(brandName) {
  try {
    const searchQuery = encodeURIComponent(brandName);
    const rssUrl = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed = await parser.parseURL(rssUrl);
    
    if (feed && feed.items) {
      return feed.items.slice(0, 15).map(item => ({
        source: 'google-news',
        title: item.title || '',
        content: item.contentSnippet || item.title || '',
        url: item.link || '',
        author: item.creator || item.source?.name || 'Google News',
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
      }));
    }
    return [];
  } catch (error) {
    console.error('Google News RSS Error:', error.message);
    return [];
  }
}

/**
 * Fetch mentions from HackerNews API (FREE - No API key required)
 */
async function fetchFromHackerNews(brandName) {
  try {
    // Get latest story IDs
    const topStoriesResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = topStoriesResponse.data.slice(0, 100); // Get top 100 stories
    
    // Fetch stories in parallel (limited to 10)
    const storyPromises = storyIds.slice(0, 10).map(id =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .catch(() => null)
    );
    
    const stories = await Promise.all(storyPromises);
    const brandMentions = stories
      .filter(story => story && story.data)
      .filter(story => {
        const title = (story.data.title || '').toLowerCase();
        const text = (story.data.text || '').toLowerCase();
        return title.includes(brandName.toLowerCase()) || text.includes(brandName.toLowerCase());
      })
      .map(story => ({
        source: 'hackernews',
        title: story.data.title || '',
        content: story.data.text || story.data.title || '',
        url: story.data.url || `https://news.ycombinator.com/item?id=${story.data.id}`,
        author: story.data.by || 'Unknown',
        publishedAt: story.data.time ? new Date(story.data.time * 1000) : new Date()
      }));
    
    return brandMentions;
  } catch (error) {
    console.error('HackerNews API Error:', error.message);
    return [];
  }
}

/**
 * Fetch mentions from Reddit (FREE - Works without auth for public data)
 */
async function fetchFromReddit(brandName, clientId, clientSecret) {
  try {
    // Try authenticated first if credentials provided
    if (clientId && clientSecret && clientId !== 'your_reddit_client_id') {
      try {
        const authResponse = await axios.post(
          'https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            auth: {
              username: clientId,
              password: clientSecret
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        const accessToken = authResponse.data.access_token;

        const searchResponse = await axios.get(
          `https://oauth.reddit.com/search.json?q=${encodeURIComponent(brandName)}&limit=15&sort=new`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'User-Agent': 'BrandTracker/1.0'
            }
          }
        );

        if (searchResponse.data.data?.children) {
          return searchResponse.data.data.children.map(post => ({
            source: 'reddit',
            title: post.data.title || '',
            content: post.data.selftext || post.data.title || '',
            url: `https://reddit.com${post.data.permalink}`,
            author: post.data.author || 'Unknown',
            publishedAt: new Date(post.data.created_utc * 1000)
          }));
        }
      } catch (authError) {
        console.warn('Reddit auth failed, trying public API:', authError.message);
      }
    }

    // Fallback to public JSON API (no auth needed)
    const publicResponse = await axios.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(brandName)}&limit=15&sort=new`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (publicResponse.data.data?.children) {
      return publicResponse.data.data.children.map(post => ({
        source: 'reddit',
        title: post.data.title || '',
        content: post.data.selftext || post.data.title || '',
        url: `https://reddit.com${post.data.permalink}`,
        author: post.data.author || 'Unknown',
        publishedAt: new Date(post.data.created_utc * 1000)
      }));
    }
    return [];
  } catch (error) {
    console.error('Reddit API Error:', error.message);
    return [];
  }
}

/**
 * Fetch mentions from NewsAPI (Requires free API key)
 */
async function fetchFromNewsAPI(brandName, apiKey) {
  if (!apiKey || apiKey === 'your_newsapi_key_here') {
    return [];
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: brandName,
        sortBy: 'publishedAt',
        pageSize: 15,
        language: 'en',
        apiKey: apiKey
      },
      timeout: 5000
    });

    if (response.data.articles) {
      return response.data.articles.map(article => ({
        source: 'newsapi',
        title: article.title || '',
        content: article.description || article.title || '',
        url: article.url || '',
        author: article.author || article.source?.name || 'Unknown',
        publishedAt: new Date(article.publishedAt || Date.now())
      }));
    }
    return [];
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn('NewsAPI rate limit reached');
    } else {
      console.error('NewsAPI Error:', error.message);
    }
    return [];
  }
}

/**
 * Fetch mentions from YouTube (Requires API key)
 */
async function fetchFromYouTube(brandName, apiKey) {
  if (!apiKey || apiKey === 'your_youtube_api_key') {
    return [];
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: brandName,
        type: 'video',
        maxResults: 10,
        order: 'date',
        key: apiKey
      },
      timeout: 5000
    });

    if (response.data.items) {
      return response.data.items.map(item => ({
        source: 'youtube',
        title: item.snippet.title || '',
        content: item.snippet.description || item.snippet.title || '',
        url: `https://youtube.com/watch?v=${item.id.videoId}`,
        author: item.snippet.channelTitle || 'Unknown',
        publishedAt: new Date(item.snippet.publishedAt || Date.now())
      }));
    }
    return [];
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('YouTube API quota exceeded');
    } else {
      console.error('YouTube API Error:', error.message);
    }
    return [];
  }
}

/**
 * Fetch from Medium RSS (FREE - No API key required)
 */
async function fetchFromMedium(brandName) {
  try {
    const searchQuery = encodeURIComponent(brandName);
    const rssUrl = `https://medium.com/feed/tag/${searchQuery}`;
    
    const feed = await parser.parseURL(rssUrl);
    
    if (feed && feed.items) {
      return feed.items.slice(0, 10).map(item => ({
        source: 'medium',
        title: item.title || '',
        content: item.contentSnippet || item.title || '',
        url: item.link || '',
        author: item.creator || 'Medium Author',
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
      }));
    }
    return [];
  } catch (error) {
    // Medium RSS may not work for all tags, silently fail
    return [];
  }
}

/**
 * Process and enrich mentions with sentiment, keywords, and category
 */
function processMentions(rawMentions, brandName) {
  return rawMentions.map(mention => {
    const fullText = `${mention.title} ${mention.content}`.trim();
    const sentimentResult = analyzeSentiment(fullText);
    const keywords = extractKeywords(fullText);
    const category = categorizeMention(fullText);

    return {
      ...mention,
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.score,
      keywords: keywords,
      category: category
    };
  });
}

/**
 * Remove duplicate mentions based on URL
 */
function removeDuplicates(mentions) {
  const seen = new Set();
  return mentions.filter(mention => {
    const url = mention.url || mention.title;
    if (seen.has(url)) {
      return false;
    }
    seen.add(url);
    return true;
  });
}

/**
 * Fetch all mentions for a brand from all sources (prioritizes free APIs)
 */
async function fetchAllMentions(brandName, useDummy = false) {
  if (useDummy) {
    // Use dummy data for offline/demo mode
    const brandDummyData = dummyMentions.filter(m => 
      m.title.toLowerCase().includes(brandName.toLowerCase()) || 
      m.content.toLowerCase().includes(brandName.toLowerCase())
    );
    
    // If no matches, use all dummy data and replace brand name
    const mentions = brandDummyData.length > 0 
      ? brandDummyData 
      : dummyMentions.map(m => ({
          ...m,
          title: m.title.replace(/\[Brand\]/g, brandName),
          content: m.content.replace(/\[Brand\]/g, brandName)
        }));

    return processMentions(mentions.slice(0, 20), brandName);
  }

  const apiKey = process.env.NEWS_API_KEY;
  const redditClientId = process.env.REDDIT_CLIENT_ID;
  const redditClientSecret = process.env.REDDIT_CLIENT_SECRET;
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;

  // Fetch from all sources in parallel
  // Priority: Free APIs first (Google News, Reddit public, HackerNews)
  const [
    googleNewsMentions,
    redditMentions,
    hackerNewsMentions,
    newsAPIMentions,
    youtubeMentions
    // mediumMentions // Optional, can be slow
  ] = await Promise.allSettled([
    fetchFromGoogleNews(brandName),
    fetchFromReddit(brandName, redditClientId, redditClientSecret),
    fetchFromHackerNews(brandName),
    fetchFromNewsAPI(brandName, apiKey),
    fetchFromYouTube(brandName, youtubeApiKey)
    // fetchFromMedium(brandName) // Can be slow, uncomment if needed
  ]);

  // Extract successful results
  const allMentions = [
    ...(googleNewsMentions.status === 'fulfilled' ? googleNewsMentions.value : []),
    ...(redditMentions.status === 'fulfilled' ? redditMentions.value : []),
    ...(hackerNewsMentions.status === 'fulfilled' ? hackerNewsMentions.value : []),
    ...(newsAPIMentions.status === 'fulfilled' ? newsAPIMentions.value : []),
    ...(youtubeMentions.status === 'fulfilled' ? youtubeMentions.value : [])
  ];

  // Remove duplicates and sort by date (newest first)
  const uniqueMentions = removeDuplicates(allMentions);
  uniqueMentions.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // If no API results, fallback to dummy data
  if (uniqueMentions.length === 0) {
    console.log(`No real-time mentions found for "${brandName}", using dummy data`);
    return fetchAllMentions(brandName, true);
  }

  console.log(`✅ Fetched ${uniqueMentions.length} real-time mentions for "${brandName}" from ${new Set(uniqueMentions.map(m => m.source)).size} sources`);

  return processMentions(uniqueMentions, brandName);
}

module.exports = {
  fetchAllMentions,
  fetchFromNewsAPI,
  fetchFromReddit,
  fetchFromYouTube,
  fetchFromGoogleNews,
  fetchFromHackerNews
};
