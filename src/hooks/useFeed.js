import { useState, useEffect } from 'react'
import * as parser from 'rss-parser-browser'

const CLAUDE_CODE_FEED_URL = 'https://github.com/anthropics/claude-code/releases.atom'
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export const useFeed = (refreshInterval = 300000) => { // 5 minutes default
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use CORS proxy to fetch the atom feed
      const proxyUrl = CORS_PROXY + encodeURIComponent(CLAUDE_CODE_FEED_URL)
      
      // Use the browser-compatible RSS parser
      parser.parseURL(proxyUrl, (err, parsed) => {
        if (err) {
          console.error('Failed to parse RSS feed:', err)
          setError(err.message)
          setLoading(false)
          return
        }

        // Normalize the parsed feed to our expected format
        const normalizedFeed = {
          title: parsed.feed.title || 'Claude Code Releases',
          description: parsed.feed.description || '',
          link: parsed.feed.link || 'https://github.com/anthropics/claude-code/releases',
          lastBuildDate: parsed.feed.lastBuildDate || new Date().toISOString(),
          items: (parsed.feed.entries || []).map(entry => ({
            title: entry.title || '',
            link: entry.link || '',
            pubDate: entry.pubDate || entry.isoDate || '',
            contentSnippet: entry.contentSnippet || entry.content || 'No description available',
            content: entry.content || entry.contentSnippet || 'No description available',
            author: entry.creator || entry.author || 'anthropics',
            guid: entry.guid || entry.link || ''
          }))
        }

        setFeed(normalizedFeed)
        setLoading(false)
      })
      
    } catch (err) {
      console.error('Failed to fetch atom feed:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
    
    // Set up auto-refresh if interval is provided
    if (refreshInterval > 0) {
      const interval = setInterval(fetchFeed, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  return {
    feed,
    loading,
    error,
    refetch: fetchFeed
  }
}