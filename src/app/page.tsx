'use client'

import { useState, useEffect } from 'react'
import ChangelogEntry from '@/components/ChangelogEntry'
import LoadingSpinner from '@/components/LoadingSpinner'

interface FeedItem {
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  content: string
  author: string
  guid: string
}

interface Feed {
  title: string
  description: string
  link: string
  lastBuildDate: string
  items: FeedItem[]
}

export default function Home() {
  const [feed, setFeed] = useState<Feed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/feed')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const feedData = await response.json()
      setFeed(feedData)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch feed:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  if (loading && !feed) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-lg mx-auto">
          <h3 className="font-bold mb-2">Failed to load changelog</h3>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={fetchFeed}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!feed || !feed.items || feed.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">No changelog entries found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Claude Code Changelog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest releases and improvements to Claude Code
          </p>
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Last updated: {new Date(feed.lastBuildDate || Date.now()).toLocaleDateString()}</span>
            <button
              onClick={fetchFeed}
              className="text-orange-600 hover:text-orange-700 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </header>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-300 hidden md:block"></div>
          
          {/* Entries */}
          <div className="space-y-8">
            {feed.items.map((item, index) => (
              <div key={item.guid || item.link || index} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 w-4 h-4 bg-orange-500 border-4 border-orange-50 rounded-full hidden md:block"></div>
                
                {/* Entry content */}
                <div className="md:ml-16">
                  <ChangelogEntry item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Data sourced from{' '}
            <a
              href="https://github.com/anthropics/claude-code/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 transition-colors duration-200"
            >
              Claude Code GitHub Releases
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
