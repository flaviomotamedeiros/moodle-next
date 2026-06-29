import {
  Controller, Get, Post, Delete, Patch,
  Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { EnrollmentService } from './enrollment.service.js'
import { EnrollUserDto } from './dto/enroll-user.dto.js'

@Controller('courses/:courseId/enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  enroll(
    @Param('courseId') courseId: string,
    @Body() dto: EnrollUserDto,
  ) {
    return this.enrollmentService.enroll(courseId, dto)
  }

  @Get()
  findByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentService.findByCourse(courseId)
  }

  @Patch(':enrollmentId/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  suspend(@Param('enrollmentId') enrollmentId: string) {
    return this.enrollmentService.suspend(enrollmentId)
  }

  @Delete(':enrollmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unenroll(@Param('enrollmentId') enrollmentId: string) {
    return this.enrollmentService.unenroll(enrollmentId)
  }
}
