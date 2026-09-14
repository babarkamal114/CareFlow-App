'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Oct', overall: 80, responsive: 75 },
  { month: 'Nov', overall: 82, responsive: 77 },
  { month: 'Dec', overall: 84, responsive: 79 },
  { month: 'Jan', overall: 87, responsive: 81 },
  { month: 'Feb', overall: 91, responsive: 83 },
  { month: 'Mar', overall: 93, responsive: 84 },
  { month: 'Apr', overall: 95, responsive: 85 },
];

export function CQCScoreTrendCard() {
  const overallChange = 15;
  const bestArea = 'Caring';
  const bestAreaScore = 92;
  const focusArea = 'Responsive';
  const focusAreaScore = 78;

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold">CQC Score Trend</CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--cf-success)]" />
              <span className="text-xs text-cf-ink-60">Overall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--cf-warning)]" />
              <span className="text-xs text-cf-ink-60">Responsive</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[70, 100]}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="#16a34a"
                dot={{ fill: '#16a34a', r: 4 }}
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="responsive"
                stroke="#f59e0b"
                strokeDasharray="5 5"
                dot={{ fill: '#f59e0b', r: 4 }}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border-t border-cf-border pt-6 grid grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-cf-ink-60 uppercase">6-Month Change</p>
            <p className="text-2xl font-bold text-[var(--cf-success)]">+{overallChange} pts</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-cf-ink-60 uppercase">Best Area</p>
            <p className="text-2xl font-bold text-cf-ink">{bestArea}</p>
            <p className="text-sm text-cf-ink-60">{bestAreaScore}/100</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[var(--cf-warning)] uppercase">Focus Area</p>
            <p className="text-2xl font-bold text-[var(--cf-warning)]">{focusArea}</p>
            <p className="text-sm text-cf-ink-60">{focusAreaScore}/100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}