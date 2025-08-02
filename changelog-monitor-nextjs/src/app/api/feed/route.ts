import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

export async function GET() {
  try {
    const feed = await parser.parseURL('https://github.com/anthropics/claude-code/releases.atom')
    
    // Normalize the feed structure
    const normalizedFeed = {
      title: feed.title || 'Claude Code Releases',
      description: feed.description || '',
      link: feed.link || 'https://github.com/anthropics/claude-code/releases',
      lastBuildDate: feed.lastBuildDate || new Date().toISOString(),
      items: (feed.items || []).map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        contentSnippet: item.contentSnippet || item.content?.substring(0, 200) + '...' || 'No description available',
        content: item.content || item.contentSnippet || 'No description available',
        author: item.creator || item.author || 'anthropics',
        guid: item.guid || item.link || ''
      }))
    }

    return NextResponse.json(normalizedFeed)
  } catch (error) {
    console.error('Failed to fetch RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    )
  }
}