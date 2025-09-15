import { Course, CourseStatus, DayOfWeek } from '../../../shared/models/course.model';

export interface CourseCreateRequest {
  title: string;
  description: string;
  teacherId: string;
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  schedule: CourseScheduleRequest[];
}

export interface CourseUpdateRequest {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  maxStudents?: number;
  status?: CourseStatus;
  schedule?: CourseScheduleRequest[];
}

export interface CourseScheduleRequest {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
}

export interface CourseEnrollmentRequest {
  studentId: string;
  courseId: string;
}

export interface CourseFilters {
  status?: CourseStatus;
  teacherId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}
