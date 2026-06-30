import { Injectable } from '@nestjs/common'
import { type UserRepository, type User } from '@moodle-next/core'
import { MigrationFlagsService } from './migration-flags.service.js'
import { LegacyUserRepository } from './repositories/legacy-user.repository.js'
import { PrismaUserRepository } from '../database/prisma-user.repository.js'

/**
 * Coexist/cutover repository for Identity (users).
 * MIGRATED_IDENTITY=false → new DB first, fall back to legacy.
 * MIGRATED_IDENTITY=true  → new DB only (legacy decommissioned).
 */
@Injectable()
export class StranglerUserRepository implements UserRepository {
  constructor(
    private readonly flags: MigrationFlagsService,
    private readonly legacy: LegacyUserRepository,
    private readonly next: PrismaUserRepository,
  ) {}

  private get migrated() {
    return this.flags.isMigrated('identity')
  }

  async findById(id: string): Promise<User | null> {
    if (this.migrated) return this.next.findById(id)
    return (await this.next.findById(id)) ?? this.legacy.findById(id)
  }

  async findByEmail(email: string): Promise<User | null> {
    if (this.migrated) return this.next.findByEmail(email)
    return (await this.next.findByEmail(email)) ?? this.legacy.findByEmail(email)
  }

  async findByUsername(username: string): Promise<User | null> {
    if (this.migrated) return this.next.findByUsername(username)
    return (await this.next.findByUsername(username)) ?? this.legacy.findByUsername(username)
  }

  async save(user: User): Promise<void> {
    return this.next.save(user)
  }
}
