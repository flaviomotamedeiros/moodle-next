import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { join } from 'node:path'

/**
 * Prisma client for the NEW system database (Stage 2 coexist target).
 * The SQLite file lives at apps/api/prisma/dev.db. We pass an absolute URL so
 * runtime resolution (relative to CWD) matches the CLI (relative to schema dir).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: { url: `file:${join(process.cwd(), 'prisma', 'dev.db')}` },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
