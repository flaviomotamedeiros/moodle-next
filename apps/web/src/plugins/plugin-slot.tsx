'use client'

import { usePluginRegistry, type SlotContext } from './plugin-registry'

/**
 * Renders all plugin components registered for a named slot.
 *
 * Usage:
 *   <PluginSlot name="course.sidebar" context={{ courseId, pagePath }} />
 *
 * The core defines slots; plugins fill them. The core never imports plugin code.
 */
export function PluginSlot({
  name,
  context,
  fallback = null,
}: {
  name: string
  context: SlotContext
  fallback?: React.ReactNode
}) {
  const registry = usePluginRegistry()
  const entries = registry.getSlot(name)

  if (entries.length === 0) return <>{fallback}</>

  return (
    <>
      {entries.map(({ pluginId, component: Component }) => (
        <Component key={pluginId} context={context} />
      ))}
    </>
  )
}
