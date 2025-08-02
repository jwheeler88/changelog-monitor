import { ChangelogEntry } from '@/lib/changelog';
import { ReleaseCard } from './ReleaseCard';

interface TimelineViewProps {
  entries: ChangelogEntry[];
}

export function TimelineView({ entries }: TimelineViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-claude-orange opacity-30"></div>
        
        <div className="space-y-8">
          {entries.map((entry, index) => (
            <div key={entry.version} className="relative flex items-start gap-6">
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-3 h-3 bg-claude-orange rounded-full mt-6 relative z-10"></div>
              
              {/* Card content */}
              <div className="flex-1">
                <ReleaseCard entry={entry} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}