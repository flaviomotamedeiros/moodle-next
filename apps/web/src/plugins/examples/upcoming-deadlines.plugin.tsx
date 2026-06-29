'use client'

import { CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SlotContext } from '@/plugins/plugin-registry'
import { ACTIVITIES } from '@/lib/mock-data'

/**
 * Example first-party plugin: renders upcoming deadlines in the course sidebar.
 * Demonstrates the contract — a plugin receives a SlotContext and returns UI,
 * without the core knowing anything about it.
 *
 * Registered against the "course.sidebar" slot in providers.tsx.
 */
export function UpcomingDeadlinesBlock({ context }: { context: SlotContext }) {
  const items = (ACTIVITIES[context.courseId ?? ''] ?? [])
    .filter(a => a.status !== 'complete')
    .slice(0, 3)

  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <CalendarClock className="size-4 text-primary" />
          Próximos prazos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map(a => (
          <div key={a.id} className="flex items-start justify-between gap-3 text-sm">
            <span className="min-w-0 flex-1 truncate">{a.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {new Date(a.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
