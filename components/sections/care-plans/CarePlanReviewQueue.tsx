'use client';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ReviewQueueBlock } from  "@/components/ui"
import { CheckCircle } from 'lucide-react';

interface ReviewItem {
  id: string;
  patientName: string;
  patientInitials: string;
  patientImage?: string;
  planName: string;
  version: string;
  type: 'review' | 'approve';
  overdueDays?: number;
  submittedBy: string;
  submittedAt: Date;
}

const mockReviewItems: ReviewItem[] = [
  {
    id: '1',
    patientName: 'Dorothy Chen',
    patientInitials: 'DC',
    planName: 'Personal Care Plan',
    version: 'v2.4',
    type: 'review',
    overdueDays: 3,
    submittedBy: 'Sarah Johnson',
    submittedAt: new Date('2024-03-10'),
  },
  {
    id: '2',
    patientName: 'James Okafor',
    patientInitials: 'JO',
    planName: 'Medication Plan',
    version: 'v1.9',
    type: 'approve',
    overdueDays: 0,
    submittedBy: 'Michael Chen',
    submittedAt: new Date('2024-03-12'),
  },
  {
    id: '3',
    patientName: 'Edna Morris',
    patientInitials: 'EM',
    planName: 'Nutrition Plan',
    version: 'v3.2',
    type: 'review',
    overdueDays: 7,
    submittedBy: 'Emma Williams',
    submittedAt: new Date('2024-03-05'),
  },
  {
    id: '4',
    patientName: 'Robert Hayes',
    patientInitials: 'RH',
    planName: 'Mobility Plan',
    version: 'v1.3',
    type: 'approve',
    overdueDays: 0,
    submittedBy: 'David Smith',
    submittedAt: new Date('2024-03-13'),
  },
  {
    id: '5',
    patientName: 'Sophie Martinez',
    patientInitials: 'SM',
    planName: 'Mental Health Plan',
    version: 'v0.6',
    type: 'review',
    overdueDays: 1,
    submittedBy: 'Lisa Garcia',
    submittedAt: new Date('2024-03-09'),
  },
];

function CarePlanReviewQueue() {
  const totalItems = mockReviewItems.length;
  const overdueItems = mockReviewItems.filter(item => (item.overdueDays || 0) > 0).length;

  return (
    <Card className="w-full max-w-sm h-full border-cf-border ">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <h1 className="text-lg font-semibold">Review Queue</h1>
              <Badge variant="pastel-amber" shape="pill" badgeSize={'md'}>
                {totalItems}
              </Badge>
            </div>
            {overdueItems > 0 && (
              <Badge variant="pastel-danger" shape="pill" badgeSize={'md'}>
                {overdueItems} overdue
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
        {mockReviewItems.length === 0 ? (
          <div className="text-center py-8 text-cf-ink-60">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-cf-success" />
            <p className="text-sm">All caught up!</p>
            <p className="text-xs mt-1">No items in review queue</p>
          </div>
        ) : (
          mockReviewItems.map((item) => (
            <ReviewQueueBlock
              key={item.id}
              patientName={item.patientName}
              patientInitials={item.patientInitials}
              patientImage={item.patientImage}
              planName={item.planName}
              version={item.version}
              type={item.type}
              overdueDays={item.overdueDays}
              submittedBy={item.submittedBy}
              submittedAt={item.submittedAt}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default CarePlanReviewQueue;