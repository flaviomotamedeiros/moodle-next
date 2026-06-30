import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { GradingService } from './grading.service.js'
import { AssignGradeDto, OverrideGradeDto } from './dto/assign-grade.dto.js'
import { presentGrade } from '../../shared/presenters.js'

@Controller('grades')
@UseGuards(JwtAuthGuard)
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  /** Assign or update a grade for a student's activity. */
  @Post('activities/:activityId')
  async assign(@Param('activityId') activityId: string, @Body() dto: AssignGradeDto) {
    return presentGrade(await this.gradingService.assign(activityId, dto))
  }

  /** Manual override of a grade — always audited. */
  @Patch(':gradeId/override')
  async override(@Param('gradeId') gradeId: string, @Body() dto: OverrideGradeDto) {
    return presentGrade(await this.gradingService.override(gradeId, dto))
  }

  /** Gradebook for a specific enrollment in a course. */
  @Get('courses/:courseId')
  async getGradebook(
    @Param('courseId') courseId: string,
    @Query('enrollmentId') enrollmentId: string,
  ) {
    const { finalGrade, grades } = await this.gradingService.getGradebook(courseId, enrollmentId)
    return { finalGrade, grades: grades.map(presentGrade) }
  }
}
