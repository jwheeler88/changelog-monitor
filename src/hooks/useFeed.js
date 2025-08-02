import { useState, useEffect } from 'react'
import { XMLParser } from 'fast-xml-parser'

const CLAUDE_CODE_FEED_URL = 'https://github.com/anthropics/claude-code/releases.atom'
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

export const useFeed = (refreshInterval = 300000) => { // 5 minutes default
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parseAtomFeed = (xmlData) => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseTagValue: true,
      parseAttributeValue: true,
      trimValues: true
    })

    const result = parser.parse(xmlData)
    
    // Handle Atom feed structure
    const feedData = result.feed || result
    const entries = feedData.entry || []
    
    // Normalize entries to match expected structure
    const normalizedEntries = Array.isArray(entries) ? entries : [entries]
    
    return {
      title: feedData.title?.['#text'] || feedData.title || 'Claude Code Releases',
      description: feedData.subtitle?.['#text'] || feedData.subtitle || '',
      link: feedData.link?.[0]?.['@_href'] || feedData.link?.['@_href'] || '',
      lastBuildDate: feedData.updated || new Date().toISOString(),
      items: normalizedEntries.map(entry => ({
        title: entry.title?.['#text'] || entry.title || '',
        link: entry.link?.['@_href'] || entry.link || '',
        pubDate: entry.published || entry.updated || '',
        contentSnippet: entry.content?.['#text'] || entry.summary?.['#text'] || entry.content || entry.summary || '',
        content: entry.content?.['#text'] || entry.summary?.['#text'] || entry.content || entry.summary || '',
        author: entry.author?.name || entry.author || '',
        guid: entry.id || entry.link?.['@_href'] || entry.link || ''
      }))
    }
  }

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try direct fetch first, then fallback to CORS proxy
      let feedUrl = CLAUDE_CODE_FEED_URL
      
      try {
        const response = await fetch(feedUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const xmlData = await response.text()
        const parsedFeed = parseAtomFeed(xmlData)
        setFeed(parsedFeed)
      } catch (corsError) {
        console.warn('Direct fetch failed, trying CORS proxy:', corsError.message)
        feedUrl = CORS_PROXY + CLAUDE_CODE_FEED_URL
        const response = await fetch(feedUrl)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const xmlData = await response.text()
        const parsedFeed = parseAtomFeed(xmlData)
        setFeed(parsedFeed)
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