import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PluginRegistryService } from '../../infrastructure/plugin-registry/plugin-registry.service.js'
import { EventBusService } from '../../infrastructure/event-bus/event-bus.service.js'
import { LoginFailed, LoginSucceeded } from '@moodle-next/core'
import type { LoginDto } from './dto/login.dto.js'

export interface JwtPayload {
  sub: string
  email: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

/**
 * Delegates authentication to installed AuthPlugins in priority order.
 * The first plugin to return a result wins.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly jwtService: JwtService,
    private readonly plugins: PluginRegistryService,
    private readonly eventBus: EventBusService,
  ) {}

  async login(dto: LoginDto): Promise<TokenPair> {
    const authPlugins = this.plugins.listAuthPlugins()

    for (const plugin of authPlugins) {
      const result = await plugin.authenticate({
        username: dto.username,
        password: dto.password,
      })

      if (result) {
        const payload: JwtPayload = { sub: result.user.id, email: dto.username }
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

        await this.eventBus.dispatch([
          new LoginSucceeded(result.user.id, `session-${Date.now()}`),
        ])

        return { accessToken, refreshToken }
      }
    }

    await this.eventBus.dispatch([
      new LoginFailed(dto.username, 'No auth plugin authenticated the credentials'),
    ])

    throw new UnauthorizedException('Invalid credentials')
  }

  async validateToken(payload: JwtPayload): Promise<JwtPayload> {
    return payload
  }
}
