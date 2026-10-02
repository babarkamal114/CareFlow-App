import { Badge, Button, Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle, Separator, Progress, ProgressIndicator, ProgressTrack } from '@/components/ui'
import { Shield, Heart, Users, Clock, Award, AlertTriangle } from 'lucide-react'
import React from 'react'
import { getProgressColor, getStatusFromScore, getIconColor } from 'utils'

interface CQCQuestion {
  id: string
  label: string
  icon: React.ElementType
  score: number
  improvements?: string[]
}

const mockData: CQCQuestion[] = [
  {
    id: 'safe',
    label: 'Safe',
    icon: Shield,
    score: 90,
    improvements: [],
  },
  {
    id: 'effective',
    label: 'Effective',
    icon: Heart,
    score: 85,
    improvements: [],
  },
  {
    id: 'caring',
    label: 'Caring',
    icon: Users,
    score: 92,
    improvements: [],
  },
  {
    id: 'responsive',
    label: 'Responsive',
    icon: Clock,
    score: 78,
    improvements: [
      'Improve response times to urgent care requests',
      'Reduce wait times for care plan reviews',
      'Enhance communication with families',
    ],
  },
  {
    id: 'well-led',
    label: 'Well-Led',
    icon: Award,
    score: 72,
    improvements: [
      'Strengthen governance framework',
      'Improve staff retention rates',
      'Enhance incident reporting culture',
      'Regular management meetings required',
    ],
  },
]

function CQCReadinessCard() {
  const needsImprovement = mockData.filter(q => {
    const { status } = getStatusFromScore(q.score)
    return status !== 'good'
  })

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className='font-bold text-cf-ink'>
            CQC Five Questions
          </CardTitle>
          <CardAction className='flex gap-x-4'>
            <Button size='sm' variant='brandOutline'>
              Drill-Down
            </Button>
            <Separator orientation='vertical' />
            <Button size='sm' variant='outline-muted'>
              Export Evidence
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mockData.map((item) => {
          const Icon = item.icon
          const progressColor = getProgressColor(item.score)
          const iconColor = getIconColor(item.score)
          const { label, badgeVariant } = getStatusFromScore(item.score)

          return (
            <div key={item.id} className='flex items-center gap-x-4'>
              <div className='flex items-center gap-x-2 w-28 flex-shrink-0'>
                <Icon className={`size-4 ${iconColor}`} />
                <h1 className='text-sm font-semibold text-cf-ink'>{item.label}</h1>
              </div>
              <div className='flex-1'>
                <Progress value={item.score} trackSize="default">
                  <ProgressTrack>
                    <ProgressIndicator className={progressColor} />
                  </ProgressTrack>
                </Progress>
              </div>
              <div className='flex items-center gap-x-2 flex-shrink-0 min-w-[140px] justify-end'>
                <h1 className='text-lg font-bold text-cf-ink w-12 text-right'>{item.score}</h1>
                <Badge variant={badgeVariant} badgeSize='md' shape='pill' className='whitespace-nowrap'>
                  {label}
                </Badge>
              </div>
            </div>
          )
        })}
      </CardContent>

      {needsImprovement.length > 0 && (
        <CardFooter className="flex-col items-start gap-3 border-t border-cf-border pt-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--cf-warning)]" />
            <span className="text-sm font-semibold text-cf-ink">Areas Needing Improvement</span>
          </div>
          <div className="space-y-3 w-full">
            {needsImprovement.map((item) => {
              const iconColor = getIconColor(item.score)
              const { label, badgeVariant } = getStatusFromScore(item.score)

              return (
                <div key={item.id} className="pl-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${iconColor}`}>{item.label}</span>
                    <span className="text-xs text-cf-ink-40">•</span>
                    <span className="text-xs text-cf-ink-60">Score: {item.score}%</span>
                    <Badge variant={badgeVariant} badgeSize='sm' shape='rounded'>
                      {label}
                    </Badge>
                  </div>
                  {item.improvements && item.improvements.length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-4">
                      {item.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-xs text-cf-ink-60 list-disc">
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default CQCReadinessCard