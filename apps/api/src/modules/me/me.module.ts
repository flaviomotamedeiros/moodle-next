import { Module } from '@nestjs/common'
import { MeController } from './me.controller.js'
import { EnrollmentModule } from '../enrollment/enrollment.module.js'
import { CourseModule } from '../course/course.module.js'

@Module({
  imports: [EnrollmentModule, CourseModule],
  controllers: [MeController],
})
export class MeModule {}
