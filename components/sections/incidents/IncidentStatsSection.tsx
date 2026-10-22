'use client';

import { motion } from 'framer-motion';
import { StatCard } from 'shared';
import { Incident } from 'types';
import { getIncidentStatCards } from 'utils';

interface IncidentStatsSectionProps {
  incidents: Incident[];
}

export function IncidentStatsSection({ incidents }: IncidentStatsSectionProps) {
  const cards = getIncidentStatCards(incidents);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}