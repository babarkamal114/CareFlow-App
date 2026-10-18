'use client';

import { CheckCircle2 } from 'lucide-react';

interface ChainStep {
  role: string;
  name: string;
  notified: boolean;
  notifiedAt?: string;
}

interface SafeguardingNotificationChainProps {
  chain: ChainStep[];
}

export function SafeguardingNotificationChain({ chain }: SafeguardingNotificationChainProps) {
  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-xs font-semibold text-cf-ink-60 uppercase tracking-wide mb-2">
        Notification Chain
      </p>
      {chain.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              step.notified ? 'bg-[var(--cf-success)]' : 'bg-cf-border'
            }`}
          >
            {step.notified && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <span className="text-xs text-cf-ink flex-1">
            {step.role} — <span className="font-medium">{step.name}</span>
          </span>
          {step.notified ? (
            <span className="text-xs text-cf-ink-40">{step.notifiedAt}</span>
          ) : (
            <span className="text-xs text-[var(--cf-warning)] font-medium">Pending</span>
          )}
        </div>
      ))}
    </div>
  );
}
