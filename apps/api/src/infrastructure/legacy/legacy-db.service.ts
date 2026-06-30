import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createPool, type Pool } from 'mysql2/promise'

/** Values accepted by a parameterized legacy query. */
type SqlParam = string | number | null

/**
 * Read-only connection to the legacy Moodle MariaDB database.
 * This service is the Anticorruption Layer boundary:
 * nothing outside of /infrastructure/legacy/ may import it.
 */
@Injectable()
export class LegacyDbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(LegacyDbService.name)
  private pool!: Pool

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.pool = createPool({
      host: this.config.get('LEGACY_DB_HOST', 'localhost'),
      port: this.config.get<number>('LEGACY_DB_PORT', 3307),
      user: this.config.get('LEGACY_DB_USER', 'moodle'),
      password: this.config.get('LEGACY_DB_PASSWORD', 'moodlepassword'),
      database: this.config.get('LEGACY_DB_NAME', 'moodle'),
      connectionLimit: 5,
      // Read-only: enforced at the MySQL user level in production
    })
    this.logger.log('Connected to legacy Moodle database (read-only)')
  }

  async onModuleDestroy() {
    await this.pool.end()
  }

  async query<T = unknown>(sql: string, params: SqlParam[] = []): Promise<T[]> {
    const [rows] = await this.pool.execute(sql, params)
    return rows as T[]
  }
}
