'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui"
import { cn } from 'lib';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface StaffViewTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function StaffViewTabs({ tabs, activeTab, onTabChange }: StaffViewTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Staff sections"
      className="flex gap-1 overflow-x-auto border-b border-border px-4 sm:px-6"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <Button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            variant="ghost"
            onClick={() => onTabChange(id)}
            className={cn(
              'relative h-auto gap-2 rounded-none px-4 py-3 text-sm font-medium whitespace-nowrap hover:bg-transparent',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon
              className={cn(
                'size-4 transition-all duration-200',
                isActive && 'scale-110 text-primary',
              )}
            />
            <span>{label}</span>

            {isActive && (
              <motion.span
                layoutId="staff-drawer-tab-indicator"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}