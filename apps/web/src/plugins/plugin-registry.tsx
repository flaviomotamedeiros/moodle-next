'use client'

import * as React from 'react'

/**
 * Frontend plugin registry — the UI counterpart of the backend PluginRegistry.
 * Plugins register React components against named slots. The core renders
 * whatever is registered, without knowing anything about the plugin.
 *
 * This is the UI realization of the "Plugin Slot" concept from
 * docs/domain/ubiquitous-language.md.
 */

export interface SlotContext {
  courseId?: string
  enrollmentId?: string
  userId?: string
  pagePath: string
}

export type SlotComponent = React.ComponentType<{ context: SlotContext }>

interface RegisteredSlot {
  pluginId: string
  component: SlotComponent
  /** Lower numbers render first */
  order: number
}

class PluginRegistry {
  private slots = new Map<string, RegisteredSlot[]>()

  registerUI(slotName: string, pluginId: string, component: SlotComponent, order = 100): void {
    const existing = this.slots.get(slotName) ?? []
    if (existing.some(s => s.pluginId === pluginId)) return
    this.slots.set(
      slotName,
      [...existing, { pluginId, component, order }].sort((a, b) => a.order - b.order),
    )
  }

  getSlot(slotName: string): RegisteredSlot[] {
    return this.slots.get(slotName) ?? []
  }
}

export const pluginRegistry = new PluginRegistry()

const RegistryContext = React.createContext(pluginRegistry)
export const usePluginRegistry = () => React.useContext(RegistryContext)
