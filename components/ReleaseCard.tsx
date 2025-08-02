import { ChangelogEntry } from '@/lib/changelog';

interface ReleaseCardProps {
  entry: ChangelogEntry;
}

export function ReleaseCard({ entry }: ReleaseCardProps) {
  const hasChanges = entry.changes.length > 0;

  return (
    <div className="bg-claude-dark-grey p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-claude-orange text-white px-3 py-1 rounded-full text-sm font-medium">
          v{entry.version}
        </div>
        {entry.date && (
          <span className="text-claude-text-light text-sm">{entry.date}</span>
        )}
      </div>

      {hasChanges ? (
        <div className="space-y-2">
          <ul className="space-y-2">
            {entry.changes.map((change, index) => (
              <li 
                key={index} 
                className="text-claude-text-light text-sm list-disc ml-4"
                dangerouslySetInnerHTML={{ __html: change }}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-claude-text-light text-sm italic">No changes documented</p>
      )}
    </div>
  );
}