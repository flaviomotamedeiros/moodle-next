import * as React from 'react'
import { cn, initials } from '@/lib/utils'

const SIZES = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
} as const

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string
  src?: string
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent font-medium text-accent-foreground',
        SIZES[size],
        className,
      )}
      aria-label={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  )
}
