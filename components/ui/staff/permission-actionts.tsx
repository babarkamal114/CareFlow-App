'use client';

import { cn } from "lib";
import { ACTION_DISPLAY_NAMES, SORTED_ACTIONS } from "utils";

interface PermissionActionsProps {
  module: { id: string; label: string; actions: string[] };
  current: string[];
  isAll: boolean;
  onTogglePermission: (moduleId: string, action: string) => void;
  onToggleAllModule: (id: string) => void;
}

export function PermissionActions({
  module,
  current,
  isAll,
  onTogglePermission,
  onToggleAllModule,
}: PermissionActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Select All */}
      <button
        onClick={() => onToggleAllModule(module.id)}
        className={cn(
          'px-3 py-1.5 rounded text-sm font-medium transition-colors border',
          isAll
            ? 'bg-cf-primary/10 text-cf-primary border-cf-primary'
            : 'bg-white text-cf-ink border-cf-border hover:border-cf-primary/50'
        )}
      >
        Select All
      </button>

      {/* Individual Actions */}
      {SORTED_ACTIONS.map((action) => {
        const isAvailable = module.actions.includes(action);
        if (!isAvailable) return null;

        const granted = current.includes(action);

        return (
          <button
            key={action}
            onClick={() => onTogglePermission(module.id, action)}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors border flex items-center gap-2',
              granted
                ? 'bg-primary text-white border-cf-primary'
                : 'bg-white text-cf-ink border-cf-border hover:border-cf-primary/50'
            )}
          >
            <div className="w-3.5 h-3.5 rounded border border-current flex items-center justify-center">
              {granted && (
                <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                  <path d="M20.293 5.293L9 16.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l12-12a1 1 0 00-1.414-1.414z" />
                </svg>
              )}
            </div>
            {ACTION_DISPLAY_NAMES[action]}
          </button>
        );
      })}
    </div>
  );
}