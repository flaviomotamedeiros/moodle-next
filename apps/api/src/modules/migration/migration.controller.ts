import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { MigrationFlagsService } from '../../infrastructure/legacy/migration-flags.service.js'

/**
 * Exposes the migration status dashboard.
 * GET /api/migration/status shows which modules are running on the new stack.
 */
@Controller('migration')
@UseGuards(JwtAuthGuard)
export class MigrationController {
  constructor(private readonly flags: MigrationFlagsService) {}

  @Get('status')
  status() {
    const modules = this.flags.status()
    const total = Object.keys(modules).length
    const migrated = Object.values(modules).filter(Boolean).length

    return {
      progress: `${migrated}/${total} modules migrated`,
      percentage: Math.round((migrated / total) * 100),
      modules,
    }
  }
}
