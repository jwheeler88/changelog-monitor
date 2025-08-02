import { useState, useEffect } from 'react'

const GITHUB_API_URL = 'https://api.github.com/repos/anthropics/claude-code/releases'

export const useFeed = (refreshInterval = 300000) => { // 5 minutes default
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const normalizeGitHubReleases = (releases) => {
    return {
      title: 'Claude Code Releases',
      description: 'Latest releases and updates for Claude Code',
      link: 'https://github.com/anthropics/claude-code/releases',
      lastBuildDate: releases[0]?.published_at || new Date().toISOString(),
      items: releases.map(release => ({
        title: release.name || release.tag_name,
        link: release.html_url,
        pubDate: release.published_at,
        contentSnippet: release.body || 'No description available',
        content: release.body || 'No description available',
        author: release.author?.login || 'anthropics',
        guid: release.id.toString()
      }))
    }
  }

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(GITHUB_API_URL)
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }
      
      const releases = await response.json()
      const normalizedFeed = normalizeGitHubReleases(releases)
      setFeed(normalizedFeed)
      
    } catch (err) {
      console.error('Failed to fetch GitHub releases:', err)
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