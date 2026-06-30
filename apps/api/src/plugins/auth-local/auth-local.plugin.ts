import { Injectable, Inject } from '@nestjs/common'
import type { AuthPlugin, AuthResult, Credentials, Migration } from '@moodle-next/plugin-sdk'
import type { UserRepository } from '@moodle-next/core'

/**
 * Local AuthPlugin — validates credentials against the user repository
 * (the new database, post-migration).
 *
 * NOTE (prototype simplification): passwords are not verified against Moodle's
 * mixed hash schemes; we accept the known seed password. The user must exist in
 * the (migrated) user store.
 */
@Injectable()
export class AuthLocalPlugin implements AuthPlugin {
  private readonly SEED_PASSWORD = 'Moodle@2025'
  private readonly ADMIN_PASSWORD = 'admin123'

  metadata = {
    id: 'auth_local',
    name: 'Local Authentication',
    version: '0.1.0',
    requires: '0.1.0',
    description: 'Authenticates against the platform user store.',
    author: 'moodle-next',
  }

  constructor(@Inject('USER_REPOSITORY') private readonly users: UserRepository) {}

  getMigrations(): Migration[] {
    return []
  }

  async authenticate(credentials: Credentials): Promise<AuthResult | null> {
    const user = await this.users.findByUsername(credentials.username.trim().toLowerCase())
    if (!user || user.isDeleted) return null

    const isAdmin = user.username === 'admin'
    const expected = isAdmin ? this.ADMIN_PASSWORD : this.SEED_PASSWORD
    if (credentials.password !== expected) return null

    return {
      user: { id: user.id },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }
  }

  canChangePassword(): boolean {
    return false
  }
}
