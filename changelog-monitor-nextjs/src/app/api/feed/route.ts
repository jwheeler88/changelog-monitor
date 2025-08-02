import { NextResponse } from 'next/server'
import { marked } from 'marked'

interface ChangelogEntry {
  version: string
  title: string
  link: string
  pubDate: string
  contentSnippet: string
  content: string
  author: string
  guid: string
}

export async function GET() {
  try {
    // Fetch the raw CHANGELOG.md from GitHub
    const response = await fetch('https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md')
    if (!response.ok) {
      throw new Error(`Failed to fetch changelog: ${response.status}`)
    }
    
    const markdownContent = await response.text()
    
    // Parse the markdown and extract version entries
    const entries = parseChangelog(markdownContent)
    
    // Normalize the feed structure
    const normalizedFeed = {
      title: 'Claude Code Changelog',
      description: 'Stay up to date with the latest releases and improvements to Claude Code',
      link: 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md',
      lastBuildDate: new Date().toISOString(),
      items: entries
    }

    return NextResponse.json(normalizedFeed)
  } catch (error) {
    console.error('Failed to fetch changelog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch changelog' },
      { status: 500 }
    )
  }
}

function parseChangelog(markdown: string): ChangelogEntry[] {
  const lines = markdown.split('\n')
  const entries: ChangelogEntry[] = []
  let currentEntry: Partial<ChangelogEntry> | null = null
  let currentContent: string[] = []
  
  for (const line of lines) {
    // Check if this is a version header (e.g., ## 1.0.65)
    const versionMatch = line.match(/^##\s+(\d+\.\d+\.\d+)/)
    
    if (versionMatch) {
      // Save the previous entry if it exists
      if (currentEntry && currentContent.length > 0) {
        const rawContent = currentContent.join('\n').trim()
        const htmlContent = marked(rawContent) as string
        
        currentEntry.content = htmlContent
        // Create a plain text snippet by removing HTML tags
        const plainText = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
        currentEntry.contentSnippet = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
        entries.push(currentEntry as ChangelogEntry)
      }
      
      // Start a new entry
      const version = versionMatch[1]
      currentEntry = {
        version,
        title: `Claude Code v${version}`,
        link: `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#${version.replace(/\./g, '')}`,
        pubDate: new Date().toISOString(), // We don't have actual dates, so use current date
        author: 'Anthropic',
        guid: `claude-code-v${version}`
      }
      currentContent = []
    } else if (currentEntry && line.trim()) {
      // Add content lines to the current entry
      currentContent.push(line)
    }
  }
  
  // Don't forget the last entry
  if (currentEntry && currentContent.length > 0) {
    const rawContent = currentContent.join('\n').trim()
    const htmlContent = marked(rawContent) as string
    
    currentEntry.content = htmlContent
    const plainText = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    currentEntry.contentSnippet = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
    entries.push(currentEntry as ChangelogEntry)
  }
  
  return entries
}