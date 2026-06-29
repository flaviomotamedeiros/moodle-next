import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * Placeholder for the Prisma client.
 * Replace with: import { PrismaClient } from '@prisma/client'
 * when the database schema is defined in packages/database.
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name)

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('DATABASE_URL')
    this.logger.log(`Connecting to database at ${url}`)
    // await this.prisma.$connect()
  }

  async onModuleDestroy() {
    // await this.prisma.$disconnect()
  }
}
