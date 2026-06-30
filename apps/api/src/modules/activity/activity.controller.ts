import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { ActivityService } from './activity.service.js'
import { CreateSubmissionDto } from './dto/create-submission.dto.js'
import { presentActivity, presentSubmission } from '../../shared/presenters.js'

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /** List activities of a course: GET /activities?courseId=2 */
  @Get()
  async listByCourse(@Query('courseId') courseId: string) {
    const activities = await this.activityService.findByCourse(courseId)
    return activities.map(presentActivity)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return presentActivity(await this.activityService.findById(id))
  }

  /** Student's submission for an activity (or null). */
  @Get(':id/submission')
  async getSubmission(
    @Param('id') activityId: string,
    @Query('enrollmentId') enrollmentId: string,
  ) {
    const submission = await this.activityService.getSubmission(activityId, enrollmentId)
    return submission ? presentSubmission(submission) : null
  }

  /** Submit (or edit) a response — persisted in the new database. */
  @Post(':id/submissions')
  async submit(@Param('id') activityId: string, @Body() dto: CreateSubmissionDto) {
    return presentSubmission(await this.activityService.submit(activityId, dto))
  }

  @Get(':id/completion')
  getCompletion(
    @Param('id') activityId: string,
    @Query('enrollmentId') enrollmentId: string,
  ) {
    return this.activityService.getCompletionStatus(activityId, enrollmentId)
  }
}
