import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common'
import type { FastifyReply } from 'fastify'

export class DomainException extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode: number = HttpStatus.UNPROCESSABLE_ENTITY,
  ) {
    super(message)
  }
}

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name)

  catch(exception: DomainException, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>()
    this.logger.warn(`Domain error: ${exception.code} — ${exception.message}`)
    reply.status(exception.statusCode).send({
      error: exception.code,
      message: exception.message,
    })
  }
}
