import { useState, useEffect } from 'react'
import Parser from 'rss-parser'

const CLAUDE_CODE_FEED_URL = 'https://github.com/anthropics/claude-code/releases.atom'
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

export const useFeed = (refreshInterval = 300000) => { // 5 minutes default
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const parser = new Parser({
        customFields: {
          item: ['author', 'category']
        }
      })
      
      // Try direct fetch first, then fallback to CORS proxy
      let feedUrl = CLAUDE_CODE_FEED_URL
      
      try {
        const result = await parser.parseURL(feedUrl)
        setFeed(result)
      } catch (corsError) {
        console.warn('Direct fetch failed, trying CORS proxy:', corsError.message)
        feedUrl = CORS_PROXY + CLAUDE_CODE_FEED_URL
        const result = await parser.parseURL(feedUrl)
        setFeed(result)
      }
      
    } catch (err) {
      console.error('Failed to fetch RSS feed:', err)
      setError(err.message)
    } finally {
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