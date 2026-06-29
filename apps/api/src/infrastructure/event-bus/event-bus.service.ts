import { Injectable, Logger } from '@nestjs/common'
import type { DomainEvent } from '@moodle-next/core'

type Handler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>

/**
 * In-process event bus for development.
 * In production, swap the dispatch method body to publish to BullMQ/Redis.
 */
@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name)
  private readonly handlers = new Map<string, Handler[]>()

  on<T extends DomainEvent>(eventName: string, handler: Handler<T>): void {
    const existing = this.handlers.get(eventName) ?? []
    this.handlers.set(eventName, [...existing, handler as Handler])
  }

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      this.logger.debug(`Dispatching ${event.eventName} [${event.aggregateId}]`)
      const handlers = this.handlers.get(event.eventName) ?? []
      await Promise.all(handlers.map(h => h(event)))
    }
  }
}
