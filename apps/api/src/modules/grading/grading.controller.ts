import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { GradingService } from './grading.service.js'
import { AssignGradeDto, OverrideGradeDto } from './dto/assign-grade.dto.js'

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  /** Assign or update a grade for a student's activity. */
  @Post('activities/:activityId')
  assign(
    @Param('activityId') activityId: string,
    @Body() dto: AssignGradeDto,
  ) {
    return this.gradingService.assign(activityId, dto)
  }

  /** Manual override of a grade — always audited. */
  @Patch(':gradeId/override')
  override(
    @Param('gradeId') gradeId: string,
    @Body() dto: OverrideGradeDto,
  ) {
    return this.gradingService.override(gradeId, dto)
  }

  /** Gradebook for a specific enrollment in a course. */
  @Get('courses/:courseId')
  getGradebook(
    @Param('courseId') courseId: string,
    @Query('enrollmentId') enrollmentId: string,
  ) {
    return this.gradingService.getGradebook(courseId, enrollmentId)
  }
}
