'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { buttonVariants } from '@/components/ui/button'
import { NOTIFICATIONS, type NotificationItem } from '@/lib/notifications'

const READ_KEY = 'mn_read_notifications'

export default function NotificationsPage() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<NotificationItem | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY)
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]))
    } catch {}
  }, [])

  function persist(ids: Set<string>) {
    setReadIds(ids)
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]))
  }

  function open(item: NotificationItem) {
    setSelected(item)
    if (!readIds.has(item.id)) persist(new Set(readIds).add(item.id))
  }

  function markAllRead() {
    persist(new Set(NOTIFICATIONS.map(n => n.id)))
  }

  const unread = NOTIFICATIONS.filter(n => !readIds.has(n.id)).length

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notificações</h1>
          <p className="mt-1 text-muted-foreground">
            {unread > 0 ? `${unread} não lidas` : 'Tudo em dia'}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck /> Marcar todas como lidas
          </Button>
        )}
      </header>

      <Card>
        <ul className="divide-y divide-border">
          {NOTIFICATIONS.map(item => {
            const Icon = item.icon
            const isUnread = !readIds.has(item.id)
            return (
              <li key={item.id}>
                <button
                  onClick={() => open(item)}
                  className={`flex w-full gap-4 p-4 text-left transition-colors hover:bg-muted/40 ${isUnread ? 'bg-accent/30' : ''}`}
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.title}</p>
                      {isUnread && <span className="size-2 rounded-full bg-primary" aria-label="não lida" />}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{item.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Notification detail */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={
          selected && (
            <span className="flex items-center gap-2">
              <selected.icon className="size-5 text-primary" />
              {selected.title}
            </span>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">{selected.time}</p>
            <p className="text-sm leading-relaxed">{selected.detail}</p>
            {selected.href && (
              <Link
                href={selected.href}
                onClick={() => setSelected(null)}
                className={buttonVariants({ size: 'sm' })}
              >
                {selected.hrefLabel ?? 'Abrir'}
              </Link>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
