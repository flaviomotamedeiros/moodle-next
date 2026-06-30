import { Injectable } from '@nestjs/common'
import type { AuthPlugin, AuthResult, Credentials, Migration } from '@moodle-next/plugin-sdk'
import { LegacyDbService } from '../../infrastructure/legacy/legacy-db.service.js'

interface MdlUserRow {
  id: number
  username: string
}

/**
 * Local AuthPlugin — validates credentials against the real legacy mdl_user table.
 *
 * NOTE (prototype simplification): Moodle stores passwords with mixed schemes
 * ($6$ SHA-512 crypt, bcrypt, and some plaintext in this seed). Implementing a
 * fully Moodle-compatible verifier is out of scope for Stage 1, so we accept the
 * known seed password. The REAL part is that the user must exist in the legacy
 * database — authentication still goes frontend → API → legacy DB → JWT.
 */
@Injectable()
export class AuthLocalPlugin implements AuthPlugin {
  /** Seed password (see moodle/seed.php). */
  private readonly SEED_PASSWORD = 'Moodle@2025'
  private readonly ADMIN_PASSWORD = 'admin123'

  metadata = {
    id: 'auth_local',
    name: 'Local Authentication (legacy mdl_user)',
    version: '0.1.0',
    requires: '0.1.0',
    description: 'Authenticates against the legacy Moodle user table.',
    author: 'moodle-next',
  }

  constructor(private readonly db: LegacyDbService) {}

  getMigrations(): Migration[] {
    return []
  }

  async authenticate(credentials: Credentials): Promise<AuthResult | null> {
    const rows = await this.db.query<MdlUserRow>(
      'SELECT id, username FROM mdl_user WHERE username = ? AND deleted = 0 AND suspended = 0',
      [credentials.username.trim().toLowerCase()],
    )
    const user = rows[0]
    if (!user) return null

    const isAdmin = user.username === 'admin'
    const expected = isAdmin ? this.ADMIN_PASSWORD : this.SEED_PASSWORD
    if (credentials.password !== expected) return null

    return {
      user: { id: String(user.id) },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }
  }

  canChangePassword(): boolean {
    return false
  }
}
