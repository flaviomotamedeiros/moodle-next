import { Injectable } from '@nestjs/common'
import { User, type UserRepository } from '@moodle-next/core'
import { LegacyDbService } from '../legacy-db.service.js'
import { UserMapper, type MdlUser } from '../mappers/user.mapper.js'

@Injectable()
export class LegacyUserRepository implements UserRepository {
  constructor(private readonly db: LegacyDbService) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.query<MdlUser>(
      'SELECT id, username, firstname, lastname, email, deleted, suspended, timecreated FROM mdl_user WHERE id = ? AND deleted = 0',
      [id],
    )
    return rows[0] ? UserMapper.toDomain(rows[0]) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db.query<MdlUser>(
      'SELECT id, username, firstname, lastname, email, deleted, suspended, timecreated FROM mdl_user WHERE email = ? AND deleted = 0',
      [email],
    )
    return rows[0] ? UserMapper.toDomain(rows[0]) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const rows = await this.db.query<MdlUser>(
      'SELECT id, username, firstname, lastname, email, deleted, suspended, timecreated FROM mdl_user WHERE username = ? AND deleted = 0',
      [username],
    )
    return rows[0] ? UserMapper.toDomain(rows[0]) : null
  }

  async save(_user: User): Promise<void> {
    // Read-only ACL: writes go to the new database, not the legacy one.
    throw new Error('LegacyUserRepository is read-only. Route writes to the new repository.')
  }
}
