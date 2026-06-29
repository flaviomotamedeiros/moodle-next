import { cn } from '@/lib/utils'

/** The moodle-next wordmark — a stacked-books glyph in the brand indigo. */
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-7 shrink-0"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M9 11.5h14M9 16h14M9 20.5h9"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="text-[15px] font-semibold tracking-tight">
          moodle<span className="text-primary">next</span>
        </span>
      )}
    </span>
  )
}
