import { useState, useEffect } from 'react'

const CLAUDE_CODE_FEED_URL = 'https://github.com/anthropics/claude-code/releases.atom'
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export const useFeed = (refreshInterval = 300000) => { // 5 minutes default
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parseAtomFeed = (xmlText) => {
    // Create a simple XML parser using DOMParser (browser built-in)
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    
    // Handle parsing errors
    if (doc.querySelector('parsererror')) {
      throw new Error('Invalid XML format')
    }

    // Extract feed information
    const feedTitle = doc.querySelector('feed > title')?.textContent || 'Claude Code Releases'
    const feedSubtitle = doc.querySelector('feed > subtitle')?.textContent || ''
    const feedLink = doc.querySelector('feed > link[rel="alternate"]')?.getAttribute('href') || 
                    'https://github.com/anthropics/claude-code/releases'
    const feedUpdated = doc.querySelector('feed > updated')?.textContent || new Date().toISOString()

    // Extract entries
    const entries = Array.from(doc.querySelectorAll('entry')).map(entry => {
      const title = entry.querySelector('title')?.textContent || ''
      const link = entry.querySelector('link')?.getAttribute('href') || ''
      const published = entry.querySelector('published')?.textContent || ''
      const updated = entry.querySelector('updated')?.textContent || ''
      const content = entry.querySelector('content')?.textContent || ''
      const summary = entry.querySelector('summary')?.textContent || ''
      const author = entry.querySelector('author > name')?.textContent || 'anthropics'
      const id = entry.querySelector('id')?.textContent || ''

      return {
        title: title,
        link: link,
        pubDate: published || updated,
        contentSnippet: summary || content || 'No description available',
        content: content || summary || 'No description available',
        author: author,
        guid: id || link
      }
    })

    return {
      title: feedTitle,
      description: feedSubtitle,
      link: feedLink,
      lastBuildDate: feedUpdated,
      items: entries
    }
  }

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use CORS proxy to fetch the atom feed
      const proxyUrl = CORS_PROXY + encodeURIComponent(CLAUDE_CODE_FEED_URL)
      const response = await fetch(proxyUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const xmlText = await response.text()
      const parsedFeed = parseAtomFeed(xmlText)
      setFeed(parsedFeed)
      
    } catch (err) {
      console.error('Failed to fetch atom feed:', err)
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