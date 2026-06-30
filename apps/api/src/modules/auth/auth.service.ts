import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PluginRegistryService } from '../../infrastructure/plugin-registry/plugin-registry.service.js'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { LegacyUserRepository } from '../../infrastructure/legacy/repositories/legacy-user.repository.js'
import { LegacyDbService } from '../../infrastructure/legacy/legacy-db.service.js'
import { LoginFailed, LoginSucceeded } from '@moodle-next/core'
import type { LoginDto } from './dto/login.dto.js'

export interface JwtPayload {
  sub: string
  email: string
}

export interface AuthUserDto {
  id: string
  username: string
  name: string
  role: 'student' | 'teacher' | 'admin'
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUserDto
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly plugins: PluginRegistryService,
    private readonly eventBus: EventBusService,
    private readonly users: LegacyUserRepository,
    private readonly db: LegacyDbService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const authPlugins = this.plugins.listAuthPlugins()

    for (const plugin of authPlugins) {
      const result = await plugin.authenticate({
        username: dto.username,
        password: dto.password,
      })

      if (result) {
        const userId = result.user.id
        const payload: JwtPayload = { sub: userId, email: dto.username }
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

        await this.eventBus.dispatch([new LoginSucceeded(userId, `session-${Date.now()}`)])

        return { accessToken, refreshToken, user: await this.buildUserDto(userId, dto.username) }
      }
    }

    await this.eventBus.dispatch([
      new LoginFailed(dto.username, 'No auth plugin authenticated the credentials'),
    ])
    throw new UnauthorizedException('Invalid credentials')
  }

  /** Builds the authenticated user's profile from the legacy database. */
  private async buildUserDto(userId: string, username: string): Promise<AuthUserDto> {
    const user = await this.users.findById(userId)
    const name = user?.fullName ?? username

    let role: AuthUserDto['role'] = 'student'
    if (username === 'admin') {
      role = 'admin'
    } else {
      const rows = await this.db.query<{ c: number }>(
        `SELECT COUNT(*) AS c
         FROM mdl_role_assignments ra
         JOIN mdl_role r ON r.id = ra.roleid
         WHERE ra.userid = ? AND r.shortname IN ('teacher', 'editingteacher')`,
        [userId],
      )
      if (Number(rows[0]?.c ?? 0) > 0) role = 'teacher'
    }

    return { id: userId, username, name, role }
  }

  async validateToken(payload: JwtPayload): Promise<JwtPayload> {
    return payload
  }
}
