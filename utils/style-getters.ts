export const eventStyleGetter = (event: any) => {
  const visit = event.resource;
  
  let backgroundColor = '#3b82f6';
  let borderColor = '#1e40af';

  if (visit.type === 'medication') {
    backgroundColor = '#10b981';
    borderColor = '#059669';
  } else if (visit.type === 'check-up') {
    backgroundColor = '#a855f7';
    borderColor = '#7e22ce';
  } else if (visit.type === 'therapy') {
    backgroundColor = '#f97316';
    borderColor = '#ea580c';
  }

  if (visit.status === 'completed') {
    backgroundColor = '#6b7280';
    borderColor = '#4b5563';
  } else if (visit.status === 'cancelled') {
    backgroundColor = '#ef4444';
    borderColor = '#dc2626';
  }

  return {
    style: {
      backgroundColor,
      borderColor,
      borderRadius: '8px',
      opacity: 0.95,
      color: 'white',
      border: `2px solid ${borderColor}`,
      display: 'block',
      fontWeight: 'bold',
      fontSize: '12px',
    },
  };
};

export const dayStyleGetter = (date: Date) => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return {
      className: 'rbc-today',
    };
  }

  return {};
};