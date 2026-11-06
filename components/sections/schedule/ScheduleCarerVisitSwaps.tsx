'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, CardHeader, CardTitle, Badge, BadgeProps } from '@/components/ui';
import { Check, X, Clock } from 'lucide-react';

interface SwapRequest {
  id: string;
  fromCarer: {
    name: string;
    image?: string;
    initials: string;
  };
  toCarer: {
    name: string;
    image?: string;
    initials: string;
  };
  date: string;
  shiftTime: string;
  shiftType: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromCarer: {
      name: 'Sarah Johnson',
      image: '',
      initials: 'SJ',
    },
    toCarer: {
      name: 'William Chen',
      image: '',
      initials: 'WC',
    },
    date: 'Thu 3 Apr',
    shiftTime: '08:00 - 14:00',
    shiftType: 'Morning',
    status: 'pending',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    fromCarer: {
      name: 'Emma Williams',
      image: '',
      initials: 'EW',
    },
    toCarer: {
      name: 'Michael Brown',
      image: '',
      initials: 'MB',
    },
    date: 'Fri 4 Apr',
    shiftTime: '14:00 - 20:00',
    shiftType: 'Afternoon',
    status: 'pending',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    fromCarer: {
      name: 'David Smith',
      image: '',
      initials: 'DS',
    },
    toCarer: {
      name: 'Lisa Garcia',
      image: '',
      initials: 'LG',
    },
    date: 'Sat 5 Apr',
    shiftTime: '20:00 - 02:00',
    shiftType: 'Night',
    status: 'pending',
    timestamp: '1 day ago',
  },
];

const shiftColors: Record<string, string> = {
  'Morning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Afternoon': 'bg-orange-100 text-orange-700 border-orange-200',
  'Evening': 'bg-blue-100 text-blue-700 border-blue-200',
  'Night': 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

interface ScheduleCarerVisitSwapsProps {
  onApprove?: (swapId: string) => void;
  onReject?: (swapId: string) => void;
}

function ScheduleCarerVisitSwaps({ onApprove, onReject }: ScheduleCarerVisitSwapsProps) {
  const [swaps, setSwaps] = useState<SwapRequest[]>(mockSwapRequests);
  const pendingSwaps = swaps.filter(s => s.status === 'pending');
  const totalPending = pendingSwaps.length;

  const handleApprove = (swapId: string) => {
    setSwaps(prev =>
      prev.map(swap =>
        swap.id === swapId
          ? { ...swap, status: 'approved' }
          : swap
      )
    );
    onApprove?.(swapId);
  };

  const handleReject = (swapId: string) => {
    setSwaps(prev =>
      prev.map(swap =>
        swap.id === swapId
          ? { ...swap, status: 'rejected' }
          : swap
      )
    );
    onReject?.(swapId);
  };

  if (totalPending === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Swaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-cf-ink-60">
            <p className="text-sm">No pending swap requests</p>
            <p className="text-xs mt-1">All shifts are assigned</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pending Swaps
          <Badge variant="pastel-danger" shape="pill" className="ml-2">
            {totalPending}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pendingSwaps.map((swap) => (
          <div
            key={swap.id}
            className="border border-cf-border rounded-lg p-4 hover:bg-cf-surface-muted/50 transition-colors flex items-center justify-between gap-4"
          >
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 border border-cf-border flex-shrink-0">
                <AvatarImage src={swap.fromCarer.image} alt={swap.fromCarer.name} />
                <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-xs font-medium">
                  {swap.fromCarer.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col min-w-0">
               
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-cf-ink truncate">
                    {swap.fromCarer.name.split(' ')[0]}
                  </span>
                  <span className="text-xs text-cf-ink-40">→</span>
                  <span className="text-sm font-medium text-cf-ink truncate">
                    {swap.toCarer.name.split(' ')[0]}
                  </span>
                </div>

               
                <div className="flex items-center gap-2 text-xs text-cf-ink-60">
                  <span>{swap.date}</span>
                  <span>•</span>
                  <span>{swap.shiftTime}</span>
                </div>

                
                <Badge
                  variant={shiftColors[swap.shiftType] as BadgeProps['variant']}
                  
                >
                  {swap.shiftType}
                </Badge>
              </div>
            </div>

           
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                onClick={() => handleApprove(swap.id)}
                title="Approve swap"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                onClick={() => handleReject(swap.id)}
                title="Reject swap"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ScheduleCarerVisitSwaps;