'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="flex gap-1 border-b border-cf-border px-4 sm:px-6 overflow-x-auto">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              isActive ? 'text-cf-ink' : 'text-cf-ink-60 hover:text-cf-ink'
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-all duration-200 ${
                isActive ? 'scale-110 text-cf-primary' : ''
              }`}
            />
            <span>{label}</span>

            {isActive && (
              <motion.span
                layoutId="staff-drawer-tab-indicator"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-cf-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}