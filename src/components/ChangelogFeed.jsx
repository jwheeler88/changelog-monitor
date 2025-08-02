import { useFeed } from '../hooks/useFeed'
import ChangelogEntry from './ChangelogEntry'
import LoadingSpinner from './LoadingSpinner'

const ChangelogFeed = () => {
  const { feed, loading, error, refetch } = useFeed()

  if (loading && !feed) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-lg mx-auto">
          <h3 className="font-bold font-claude mb-2">Failed to load changelog</h3>
          <p className="font-claude text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-claude-orange hover:bg-claude-button text-white font-claude font-medium py-2 px-4 rounded transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!feed || !feed.items || feed.items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-claude-text font-claude text-lg">
          No changelog entries found.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-claude-text font-claude mb-4">
          Claude Code Changelog
        </h1>
        <p className="text-lg text-claude-text/80 font-claude max-w-2xl mx-auto">
          Stay up to date with the latest releases and improvements to Claude Code
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-claude-text/60 font-claude">
          <span>Last updated: {new Date(feed.lastBuildDate || Date.now()).toLocaleDateString()}</span>
          <button
            onClick={refetch}
            className="text-claude-orange hover:text-claude-button transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-claude-orange/30 hidden md:block"></div>
        
        {/* Entries */}
        <div className="space-y-8">
          {feed.items.map((item, index) => (
            <div key={item.guid || item.link || index} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-4 top-6 w-4 h-4 bg-claude-orange border-4 border-claude-cream rounded-full hidden md:block"></div>
              
              {/* Entry content */}
              <div className="md:ml-16">
                <ChangelogEntry item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 pt-8 border-t border-claude-text/20">
        <p className="text-claude-text/60 font-claude">
          Data sourced from{' '}
          <a
            href="https://github.com/anthropics/claude-code/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-claude-orange hover:text-claude-button transition-colors duration-200"
          >
            Claude Code GitHub Releases
          </a>
        </p>
      </footer>
    </div>
  )
}

export default ChangelogFeed