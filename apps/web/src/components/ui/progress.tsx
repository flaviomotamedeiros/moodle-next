import { cn } from '@/lib/utils'

/** Linear progress bar with a semantic tone. */
export function Progress({
  value,
  tone = 'primary',
  className,
}: {
  value: number
  tone?: 'primary' | 'success' | 'warning'
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const toneClass = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
  }[tone]

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500', toneClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
