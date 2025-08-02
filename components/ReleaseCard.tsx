import { ChangelogEntry } from '@/lib/changelog';

interface ReleaseCardProps {
  entry: ChangelogEntry;
}

const changeTypeLabels = {
  added: 'Added',
  changed: 'Changed',
  fixed: 'Fixed',
  removed: 'Removed',
  security: 'Security',
  deprecated: 'Deprecated',
};

export function ReleaseCard({ entry }: ReleaseCardProps) {
  const hasChanges = Object.values(entry.changes).some(changes => changes.length > 0);

  return (
    <div className="bg-claude-dark-grey p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-claude-orange text-white px-3 py-1 rounded-full text-sm font-medium">
          v{entry.version}
        </div>
        <span className="text-claude-text-light text-sm">{entry.date}</span>
      </div>

      {hasChanges ? (
        <div className="space-y-4">
          {Object.entries(entry.changes).map(([type, changes]) => {
            if (changes.length === 0) return null;
            
            return (
              <div key={type}>
                <h4 className="text-claude-text-light font-medium mb-2">
                  {changeTypeLabels[type as keyof typeof changeTypeLabels]}
                </h4>
                <ul className="space-y-1 ml-4">
                  {changes.map((change, index) => (
                    <li 
                      key={index} 
                      className="text-claude-text-light text-sm list-disc"
                      dangerouslySetInnerHTML={{ __html: change }}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-claude-text-light text-sm italic">No changes documented</p>
      )}
    </div>
  );
}