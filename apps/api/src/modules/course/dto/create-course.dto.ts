import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator'

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string

  @IsString()
  @IsNotEmpty()
  shortName!: string

  @IsString()
  @IsNotEmpty()
  categoryId!: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string
}
