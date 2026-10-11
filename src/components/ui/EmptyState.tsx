import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <Icon className="h-8 w-8 text-ink-faint" strokeWidth={1.5} />
      <p className="font-display text-lg text-ink">{title}</p>
      {description && <p className="max-w-xs text-sm text-ink-faint">{description}</p>}
    </div>
  );
}
