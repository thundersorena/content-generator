import { cn } from '@/lib/utils'
import type { ExecutionStatus } from '@/lib/store/execution-store'

const CONFIG: Record<ExecutionStatus, { label: string; classes: string }> = {
  success: { label: 'Success', classes: 'bg-green-500/15 text-green-400 border-green-500/20' },
  failed:  { label: 'Failed',  classes: 'bg-red-500/15 text-red-400 border-red-500/20' },
  running: { label: 'Running', classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  pending: { label: 'Pending', classes: 'bg-muted text-muted-foreground border-border' },
}

export function StatusBadge({ status }: { status: ExecutionStatus }) {
  const cfg = CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cfg.classes)}>
      {status === 'running' && (
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
      )}
      {cfg.label}
    </span>
  )
}
