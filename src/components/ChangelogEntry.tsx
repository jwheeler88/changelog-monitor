interface ChangelogEntryProps {
  item: {
    title: string
    link: string
    pubDate: string
    contentSnippet: string
    content: string
    author: string
    guid: string
  }
}

const ChangelogEntry = ({ item }: ChangelogEntryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatContent = (content: string) => {
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
    <article className="bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
      {/* Header */}
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {item.title}
        </h2>
        <div className="flex items-center text-sm text-gray-600">
          <time dateTime={item.pubDate} className="mr-4">
            {formatDate(item.pubDate)}
          </time>
          {item.author && (
            <span className="text-orange-600">
              by {item.author}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="text-gray-700 leading-relaxed mb-4">
        <p className="whitespace-pre-wrap">
          {formatContent(item.contentSnippet || item.content)}
        </p>
      </div>

      {/* Footer */}
      <footer className="pt-4 border-t border-gray-200">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 text-sm font-medium"
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