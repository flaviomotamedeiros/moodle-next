'use client'

import { useEffect } from 'react'
import { pluginRegistry } from '@/plugins/plugin-registry'
import { UpcomingDeadlinesBlock } from '@/plugins/examples/upcoming-deadlines.plugin'

/**
 * Client-side bootstrap.
 * Registers first-party UI plugins into their slots. In production this is
 * where dynamically-loaded plugin bundles (Module Federation) self-register.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    pluginRegistry.registerUI('course.sidebar', 'mod_deadlines', UpcomingDeadlinesBlock, 10)
  }, [])

  return <>{children}</>
}
