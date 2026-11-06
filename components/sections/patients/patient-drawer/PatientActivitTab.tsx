'use client';

import { Card, CardContent } from "@/components/ui";

const mockDailyActivity = [
  {
    id: '1',
    carer: 'Sarah Johnson',
    activity: 'Morning medication administered',
    time: '08:30 AM',
    type: 'medication',
  },
  {
    id: '2',
    carer: 'Sarah Johnson',
    activity: 'Breakfast prepared and served',
    time: '09:00 AM',
    type: 'meal',
  },
  {
    id: '3',
    carer: 'Michael Chen',
    activity: 'Vitals checked - BP: 120/80',
    time: '11:30 AM',
    type: 'vital',
  },
  {
    id: '4',
    carer: 'Sarah Johnson',
    activity: 'Lunch prepared and served',
    time: '01:00 PM',
    type: 'meal',
  },
  {
    id: '5',
    carer: 'Emma Williams',
    activity: 'Physical therapy session completed',
    time: '03:30 PM',
    type: 'therapy',
  },
];

const getActivityColor = (type: string) => {
  switch (type) {
    case 'medication':
      return 'bg-blue-500/20 text-blue-600';
    case 'meal':
      return 'bg-green-500/20 text-green-600';
    case 'vital':
      return 'bg-red-500/20 text-red-600';
    case 'therapy':
      return 'bg-purple-500/20 text-purple-600';
    default:
      return 'bg-gray-500/20 text-gray-600';
  }
};

export function PatientActivityTab() {
  return (
    <div className="relative space-y-0">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-cf-border" />
      <div className="space-y-4">
        {mockDailyActivity.map((activity, index) => (
          <div key={activity.id} className="relative pl-16">
            <div
              className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-cf-surface ${getActivityColor(
                activity.type
              ).split(' ')[0]}`}
            />
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-cf-ink">{activity.activity}</p>
                  <p className="text-xs text-cf-ink-60 mt-0.5">{activity.carer}</p>
                </div>
                <span className="text-xs text-cf-ink-40 flex-shrink-0">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}