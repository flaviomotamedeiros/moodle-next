import { Module, OnModuleInit } from '@nestjs/common'
import { PluginRegistryService } from '../../infrastructure/plugin-registry/plugin-registry.service.js'
import { AuthLocalPlugin } from './auth-local.plugin.js'

/**
 * Registers the local AuthPlugin into the global PluginRegistry on startup.
 * The core never imports the plugin directly — it resolves it through the registry.
 */
@Module({
  providers: [AuthLocalPlugin],
})
export class AuthLocalModule implements OnModuleInit {
  constructor(
    private readonly registry: PluginRegistryService,
    private readonly plugin: AuthLocalPlugin,
  ) {}

  onModuleInit() {
    this.registry.register('auth', this.plugin)
  }
}
