import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { ActivityService } from './activity.service.js'
import { CreateSubmissionDto } from './dto/create-submission.dto.js'

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findById(id)
  }

  @Post(':id/submissions')
  submit(
    @Param('id') activityId: string,
    @Body() dto: CreateSubmissionDto,
  ) {
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
