import { marked } from 'marked';

export interface ChangelogEntry {
  version: string;
  date?: string;
  changes: string[];
}

export async function fetchChangelog(): Promise<string> {
  const response = await fetch(
    'https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md'
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch changelog: ${response.statusText}`);
  }
  
  return response.text();
}

export function parseChangelog(markdown: string): ChangelogEntry[] {
  const tokens = marked.lexer(markdown);
  const entries: ChangelogEntry[] = [];
  let currentEntry: Partial<ChangelogEntry> | null = null;

  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 2) {
      // Save previous entry
      if (currentEntry) {
        entries.push(currentEntry as ChangelogEntry);
      }
      
      // Start new entry - format is just "## 1.0.65" (no date)
      currentEntry = {
        version: token.text.trim(),
        changes: [],
      };
    } else if (token.type === 'list' && currentEntry) {
      // List of changes directly under version header
      for (const item of token.items) {
        if (item.text) {
          currentEntry.changes!.push(item.text);
        }
      }
    }
  }

  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry as ChangelogEntry);
  }

  return entries;
}