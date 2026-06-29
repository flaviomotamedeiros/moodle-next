import { IsString, IsNotEmpty, IsIn } from 'class-validator'
import type { EnrollmentRole } from '@moodle-next/core'

export class EnrollUserDto {
  @IsString()
  @IsNotEmpty()
  userId!: string

  @IsIn(['student', 'teacher', 'guest'])
  role!: EnrollmentRole
}
