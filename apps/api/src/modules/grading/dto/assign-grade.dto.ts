import { IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator'

export class AssignGradeDto {
  @IsString()
  @IsNotEmpty()
  enrollmentId!: string

  @IsNumber()
  @Min(0)
  value!: number

  @IsOptional()
  @IsString()
  feedback?: string
}

export class OverrideGradeDto {
  @IsNumber()
  @Min(0)
  value!: number

  @IsString()
  @IsNotEmpty()
  reason!: string
}
