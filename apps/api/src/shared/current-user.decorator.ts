import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { JwtPayload } from '../modules/auth/auth.service.js'

/** Extracts the authenticated user (JWT payload) from the request. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
