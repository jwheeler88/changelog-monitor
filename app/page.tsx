import { fetchChangelog, parseChangelog } from '@/lib/changelog';
import { TimelineView } from '@/components/TimelineView';

export default async function Home() {
  try {
    const markdown = await fetchChangelog();
    const entries = parseChangelog(markdown);

    return (
      <main className="min-h-screen bg-claude-cream">
        <div className="container mx-auto">
          <header className="text-center py-12">
            <h1 className="text-4xl font-bold text-claude-text-dark mb-2">
              Claude Code Changelog
            </h1>
            <p className="text-claude-text-dark opacity-70">
              Track the latest updates and improvements to Claude Code
            </p>
          </header>
          
          <TimelineView entries={entries} />
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-claude-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-claude-text-dark mb-4">
            Failed to Load Changelog
          </h1>
          <p className="text-claude-text-dark opacity-70">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
        </div>
      </main>
    );
  }
}