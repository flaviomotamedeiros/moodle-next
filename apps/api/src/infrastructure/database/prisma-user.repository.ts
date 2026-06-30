import { Injectable } from '@nestjs/common'
import { User, type UserRepository } from '@moodle-next/core'
import { PrismaService } from './prisma.service.js'

type Row = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  deletedAt: Date | null
}

/** User repository backed by the NEW system database (SQLite via Prisma). */
@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(r: Row): User {
    return User.reconstitute(r.id, {
      username: r.username,
      email: r.email,
      firstName: r.firstName,
      lastName: r.lastName,
      deletedAt: r.deletedAt ?? undefined,
    })
  }

  async findById(id: string): Promise<User | null> {
    const r = await this.prisma.user.findUnique({ where: { id } })
    return r ? this.toDomain(r) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const r = await this.prisma.user.findFirst({ where: { email } })
    return r ? this.toDomain(r) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const r = await this.prisma.user.findUnique({ where: { username } })
    return r ? this.toDomain(r) : null
  }

  async save(user: User): Promise<void> {
    const data = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      deletedAt: user.isDeleted ? new Date() : null,
    }
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, ...data },
      update: data,
    })
  }
}
