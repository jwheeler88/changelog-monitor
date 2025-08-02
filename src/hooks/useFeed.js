import { useState, useEffect } from 'react'

const CLAUDE_CODE_FEED_URL = 'https://github.com/anthropics/claude-code/releases.atom'
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export const useFeed = (refreshInterval = 300000) => { // 5 minutes default
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const parseAtomFeed = (xmlText) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'application/xml')
    
    // Check for parsing errors
    const parseError = doc.querySelector('parsererror')
    if (parseError) {
      throw new Error('Failed to parse XML: ' + parseError.textContent)
    }

    // Extract feed metadata
    const feedTitle = doc.querySelector('feed > title')?.textContent || 'Claude Code Releases'
    const feedSubtitle = doc.querySelector('feed > subtitle')?.textContent || ''
    const feedLink = doc.querySelector('feed > link[rel="alternate"]')?.getAttribute('href') || 
                     'https://github.com/anthropics/claude-code/releases'
    const feedUpdated = doc.querySelector('feed > updated')?.textContent || new Date().toISOString()

    // Extract entries
    const entries = Array.from(doc.querySelectorAll('feed > entry')).map(entry => {
      const title = entry.querySelector('title')?.textContent || ''
      const link = entry.querySelector('link')?.getAttribute('href') || ''
      const published = entry.querySelector('published')?.textContent || 
                       entry.querySelector('updated')?.textContent || ''
      const content = entry.querySelector('content')?.textContent || 
                     entry.querySelector('summary')?.textContent || 'No description available'
      const author = entry.querySelector('author > name')?.textContent || 'anthropics'
      const id = entry.querySelector('id')?.textContent || link

      return {
        title,
        link,
        pubDate: published,
        contentSnippet: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
        content,
        author,
        guid: id
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
      
      // Fetch the XML feed
      const response = await fetch(proxyUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const xmlText = await response.text()
      const parsedFeed = parseAtomFeed(xmlText)

      setFeed(parsedFeed)
      setLoading(false)
      
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