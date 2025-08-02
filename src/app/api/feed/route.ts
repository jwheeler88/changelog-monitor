import { NextResponse } from 'next/server'
import { marked, Token } from 'marked'

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
    
    // Debug: Log the first 1000 characters of the markdown
    console.log('Markdown content preview:', markdownContent.substring(0, 1000))
    
    // Parse the markdown and extract version entries
    const entries = parseChangelog(markdownContent)
    
    // Debug: Log how many entries we found
    console.log('Found entries:', entries.length)
    
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
  const entries: ChangelogEntry[] = []
  
  try {
    // Use marked.lexer to properly tokenize the markdown
    const tokens = marked.lexer(markdown)
    console.log('Total tokens:', tokens.length)
    
    let currentEntry: Partial<ChangelogEntry> | null = null
    let currentTokens: Token[] = []
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      
      // Log heading tokens to understand the structure
      if (token.type === 'heading') {
        console.log(`Heading found - depth: ${token.depth}, text: "${token.text}"`)
        
        // Look for version headings (depth 2, containing version numbers)
        const versionMatch = token.text.match(/(\d+\.\d+\.\d+)/)
        
        if (token.depth === 2 && versionMatch) {
          console.log('Found version heading:', versionMatch[1])
          
          // Save the previous entry if it exists
          if (currentEntry && currentTokens.length > 0) {
            const htmlContent = marked.parser(currentTokens)
            const plainText = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
            
            currentEntry.content = htmlContent
            currentEntry.contentSnippet = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
            entries.push(currentEntry as ChangelogEntry)
          }
          
          // Start a new entry
          const version = versionMatch[1]
          currentEntry = {
            version,
            title: `Claude Code v${version}`,
            link: `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#${version.replace(/\./g, '')}`,
            pubDate: new Date().toISOString(),
            author: 'Anthropic',
            guid: `claude-code-v${version}`
          }
          currentTokens = []
        } else if (currentEntry && token.depth > 2) {
          // This is a sub-heading within a version section
          currentTokens.push(token)
        }
      } else if (currentEntry) {
        // This is content within a version section
        currentTokens.push(token)
      }
    }
    
    // Don't forget the last entry
    if (currentEntry && currentTokens.length > 0) {
      const htmlContent = marked.parser(currentTokens)
      const plainText = htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      
      currentEntry.content = htmlContent
      currentEntry.contentSnippet = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
      entries.push(currentEntry as ChangelogEntry)
    }
    
    console.log('Total entries found:', entries.length)
    
  } catch (error) {
    console.error('Error parsing markdown with marked.lexer:', error)
  }
  
  return entries
}