import type { Course, Activity, Enrollment, Grade } from '@moodle-next/core'

/**
 * Maps domain aggregates to plain response DTOs using their public getters.
 * Without this, NestJS serializes the class instances raw and leaks the
 * internal `props`/`_events` structure to API clients.
 */

export interface CourseDto {
  id: string
  fullName: string
  shortName: string
  categoryId: string
  visible: boolean
}

export interface ActivityDto {
  id: string
  courseId: string
  sectionId: string
  pluginId: string
  name: string
  visible: boolean
}

export interface EnrollmentDto {
  id: string
  userId: string
  courseId: string
  role: string
  status: string
}

export interface GradeDto {
  id: string
  activityId: string
  value: number | null
  maxValue: number
  percentage: number | null
  feedback?: string
}

export const presentCourse = (c: Course): CourseDto => ({
  id: c.id,
  fullName: c.fullName,
  shortName: c.shortName,
  categoryId: c.categoryId,
  visible: c.visible,
})

export const presentActivity = (a: Activity): ActivityDto => ({
  id: a.id,
  courseId: a.courseId,
  sectionId: a.sectionId,
  pluginId: a.pluginId,
  name: a.name,
  visible: a.visible,
})

export const presentEnrollment = (e: Enrollment): EnrollmentDto => ({
  id: e.id,
  userId: e.userId,
  courseId: e.courseId,
  role: e.role,
  status: e.status,
})

export const presentGrade = (g: Grade): GradeDto => ({
  id: g.id,
  activityId: g.activityId,
  value: g.value,
  maxValue: g.maxValue,
  percentage: g.percentage,
  feedback: g.feedback,
})
