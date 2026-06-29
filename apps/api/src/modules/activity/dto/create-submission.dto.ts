import { IsString, IsNotEmpty, IsObject } from 'class-validator'

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string

  @IsObject()
  content!: Record<string, unknown>
}
