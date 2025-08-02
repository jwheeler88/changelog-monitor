const ChangelogEntry = ({ item }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatContent = (content) => {
    if (!content) return ''
    
    // Clean up the content and remove any HTML tags
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
  }

  return (
    <article className="bg-claude-card hover:bg-claude-card-hover transition-colors duration-200 rounded-lg shadow-lg p-6 mb-6 border border-gray-600">
      {/* Header */}
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-white font-claude mb-2">
          {item.title}
        </h2>
        <div className="flex items-center text-sm text-gray-300 font-claude">
          <time dateTime={item.pubDate} className="mr-4">
            {formatDate(item.pubDate)}
          </time>
          {item.author && (
            <span className="text-claude-orange">
              by {item.author}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="text-gray-100 font-claude leading-relaxed mb-4">
        <p className="whitespace-pre-wrap">
          {formatContent(item.contentSnippet || item.content)}
        </p>
      </div>

      {/* Footer */}
      <footer className="pt-4 border-t border-gray-600">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-claude-orange hover:text-claude-button transition-colors duration-200 font-claude text-sm font-medium"
        >
          View Release on GitHub
          <svg 
            className="ml-2 w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </a>
      </footer>
    </article>
  )
}

export default ChangelogEntry