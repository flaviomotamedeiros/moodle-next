'use client'

import { Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SlotContext } from '@/plugins/plugin-registry'
import { useApi } from '@/lib/use-api'

interface ActivityDto { id: string; name: string; pluginId: string }

/**
 * Example first-party plugin registered into the "course.sidebar" slot.
 * Demonstrates a plugin consuming the real API through the slot contract —
 * the core knows nothing about it.
 */
export function UpcomingDeadlinesBlock({ context }: { context: SlotContext }) {
  const { data } = useApi<ActivityDto[]>(
    context.courseId ? `/activities?courseId=${context.courseId}` : null,
  )

  const items = (data ?? []).slice(0, 5)
  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layers className="size-4 text-primary" />
          Atividades do curso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map(a => (
          <div key={a.id} className="truncate text-sm text-muted-foreground">
            {a.name}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
