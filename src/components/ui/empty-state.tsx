'use client';

import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-2.5 rounded-lg bg-muted flex items-center justify-center mb-4">
        <Icon className="size-5" />
      </div>
      <h3 className="text-lg font-medium mb-1 font-sans">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-xs">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default" className="text-sm px-3 py-2 rounded-full">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
