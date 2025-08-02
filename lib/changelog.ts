import { marked } from 'marked';

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    added: string[];
    changed: string[];
    fixed: string[];
    removed: string[];
    security: string[];
    deprecated: string[];
  };
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
  let currentChangeType: string | null = null;

  for (const token of tokens) {
    if (token.type === 'heading') {
      if (token.depth === 2) {
        // Version header like "## v1.0.0 - 2024-01-01"
        if (currentEntry) {
          entries.push(currentEntry as ChangelogEntry);
        }
        
        const headerMatch = token.text.match(/^v?([0-9]+\.[0-9]+\.[0-9]+.*?)\s*-\s*(.+)$/);
        if (headerMatch) {
          currentEntry = {
            version: headerMatch[1],
            date: headerMatch[2],
            changes: {
              added: [],
              changed: [],
              fixed: [],
              removed: [],
              security: [],
              deprecated: [],
            },
          };
        }
      } else if (token.depth === 3 && currentEntry) {
        // Change type header like "### Added"
        const changeType = token.text.toLowerCase();
        if (['added', 'changed', 'fixed', 'removed', 'security', 'deprecated'].includes(changeType)) {
          currentChangeType = changeType;
        }
      }
    } else if (token.type === 'list' && currentEntry && currentChangeType) {
      // List of changes
      for (const item of token.items) {
        if (item.text && currentEntry.changes) {
          const key = currentChangeType as keyof typeof currentEntry.changes;
          currentEntry.changes[key].push(item.text);
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