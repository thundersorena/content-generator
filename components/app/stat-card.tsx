import { LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  iconTextColor?: string
}

export function StatCard({ title, value, change, changeType = 'up', icon: Icon, iconColor, iconTextColor }: StatCardProps) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 hover:border-border transition-colors">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconColor ?? 'bg-brand/10')}>
          <Icon className={cn('w-4 h-4', iconTextColor ?? 'text-brand')} />
        </div>
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {change && (
        <p className={cn(
          'text-xs flex items-center gap-1',
          changeType === 'up' ? 'text-green-400' : changeType === 'down' ? 'text-red-400' : 'text-muted-foreground'
        )}>
          <TrendingUp className="w-3 h-3" />
          {change} from last month
        </p>
      )}
    </div>
  )
}
