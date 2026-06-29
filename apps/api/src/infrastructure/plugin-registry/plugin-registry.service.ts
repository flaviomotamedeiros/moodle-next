import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import type { ActivityPlugin, AuthPlugin, BlockPlugin } from '@moodle-next/plugin-sdk'

type AnyPlugin = ActivityPlugin | AuthPlugin | BlockPlugin

interface PluginEntry {
  type: 'activity' | 'auth' | 'block' | 'grade_aggregation'
  plugin: AnyPlugin
}

/**
 * Central registry for all installed plugins.
 * Plugins register themselves on module init.
 * The core never imports plugin code directly — only through this registry.
 */
@Injectable()
export class PluginRegistryService implements OnModuleInit {
  private readonly logger = new Logger(PluginRegistryService.name)
  private readonly registry = new Map<string, PluginEntry>()

  onModuleInit() {
    this.logger.log(`Plugin registry initialized with ${this.registry.size} plugins`)
  }

  register(type: PluginEntry['type'], plugin: AnyPlugin): void {
    const { id } = plugin.metadata
    if (this.registry.has(id)) {
      this.logger.warn(`Plugin ${id} is already registered — skipping`)
      return
    }
    this.registry.set(id, { type, plugin })
    this.logger.log(`Registered plugin: ${id} (${type})`)
  }

  getActivity(id: string): ActivityPlugin | undefined {
    const entry = this.registry.get(id)
    if (entry?.type === 'activity') return entry.plugin as ActivityPlugin
  }

  getAuth(id: string): AuthPlugin | undefined {
    const entry = this.registry.get(id)
    if (entry?.type === 'auth') return entry.plugin as AuthPlugin
  }

  listByType(type: PluginEntry['type']): AnyPlugin[] {
    return [...this.registry.values()]
      .filter(e => e.type === type)
      .map(e => e.plugin)
  }

  listAuthPlugins(): AuthPlugin[] {
    return this.listByType('auth') as AuthPlugin[]
  }

  listActivityPlugins(): ActivityPlugin[] {
    return this.listByType('activity') as ActivityPlugin[]
  }
}
