import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js'
import { CourseService } from './course.service.js'
import { CreateCourseDto } from './dto/create-course.dto.js'
import { presentCourse } from '../../shared/presenters.js'

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return presentCourse(await this.courseService.create(dto))
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return presentCourse(await this.courseService.findById(id))
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    const courses = await this.courseService.findByCategory(categoryId)
    return courses.map(presentCourse)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.courseService.delete(id)
  }
}
