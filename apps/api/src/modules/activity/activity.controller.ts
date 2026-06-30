import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { ActivityService } from './activity.service.js'
import { CreateSubmissionDto } from './dto/create-submission.dto.js'
import { presentActivity } from '../../shared/presenters.js'

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

  @Post(':id/submissions')
  submit(@Param('id') activityId: string, @Body() dto: CreateSubmissionDto) {
    return this.activityService.submit(activityId, dto)
  }

  @Get(':id/completion')
  getCompletion(
    @Param('id') activityId: string,
    @Query('enrollmentId') enrollmentId: string,
  ) {
    return this.activityService.getCompletionStatus(activityId, enrollmentId)
  }
}
