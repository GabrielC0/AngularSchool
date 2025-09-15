import { User } from '../../../shared/models/user.model';

export interface StudentCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface StudentUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface StudentProfile extends User {
  phone?: string;
  address?: string;
  enrolledCourses: EnrolledCourse[];
  totalCourses: number;
  completedCourses: number;
}

export interface EnrolledCourse {
  courseId: string;
  courseTitle: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'dropped';
  grade?: number;
}

export interface StudentFilters {
  search?: string;
  isActive?: boolean;
  courseId?: string;
}

export interface StudentListResponse {
  students: StudentProfile[];
  total: number;
  page: number;
  limit: number;
}
