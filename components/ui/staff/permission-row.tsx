'use client';

import { ChevronRight } from 'lucide-react';
import { Badge } from "@/components/ui";
import { cn } from "lib";
import { PermissionActions } from './permission-actionts';


interface PermissionRowProps {
  module: { id: string; label: string; actions: string[] };
  permissions: Record<string, string[]>;
  isExpanded: boolean;
  onToggleModule: (id: string) => void;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
}

export function PermissionRow({
  module,
  permissions,
  isExpanded,
  onToggleModule,
  onTogglePermission,
  onToggleAllModule,
}: PermissionRowProps) {
  const current = permissions[module.id] || [];
  const isAll = module.actions.every((a) => current.includes(a));
  const hasAny = current.length > 0;
  const granted = current.length;
  const total = module.actions.length;

  return (
    <div className="border border-cf-border rounded-lg overflow-hidden">
      <button
        onClick={() => onToggleModule(module.id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-cf-surface-muted/50 transition-colors text-left bg-white"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ChevronRight
            className={cn(
              'w-4 h-4 text-cf-ink-60 flex-shrink-0 transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
          <p className="text-sm font-medium text-cf-ink">{module.label}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'text-xs ml-2 flex-shrink-0',
            !hasAny && 'bg-cf-bg text-gray-600 border-gray-200',
            hasAny && !isAll && 'bg-yellow-50 text-yellow-700 border-yellow-200',
            isAll && 'bg-green-50 text-green-700 border-green-200'
          )}
        >
          {granted}/{total}
        </Badge>
      </button>

      {isExpanded && (
        <div className="border-t border-cf-border px-4 py-3 bg-cf-surface-muted/30">
          <PermissionActions
            module={module}
            current={current}
            isAll={isAll}
            onTogglePermission={onTogglePermission}
            onToggleAllModule={onToggleAllModule}
          />
        </div>
      )}
    </div>
  );
}