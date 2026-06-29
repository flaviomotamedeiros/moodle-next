import { User } from '@moodle-next/core'

/** Raw row from mdl_user */
export interface MdlUser {
  id: number
  username: string
  firstname: string
  lastname: string
  email: string
  deleted: number
  suspended: number
  timecreated: number
}

export class UserMapper {
  static toDomain(row: MdlUser): User {
    return User.reconstitute(String(row.id), {
      email: row.email,
      firstName: row.firstname,
      lastName: row.lastname,
      deletedAt: row.deleted === 1 ? new Date(row.timecreated * 1000) : undefined,
    })
  }
}
