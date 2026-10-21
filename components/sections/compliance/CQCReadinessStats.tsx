'use client';

import { StatCard } from 'shared';
import { useCqcReadiness } from 'hooks';
import { getComplianceStatCards } from '../../ui/compliance/compliance-stat-cards';

export function CQCReadinessStats() {
  const r = useCqcReadiness();
  const cards = getComplianceStatCards(r);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
