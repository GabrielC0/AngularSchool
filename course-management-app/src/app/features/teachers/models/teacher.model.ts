import { User } from '../../../shared/models/user.model';

export interface TeacherCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  specialization?: string;
}

export interface TeacherUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  specialization?: string;
  isActive?: boolean;
}

export interface TeacherProfile extends User {
  phone?: string;
  address?: string;
  specialization?: string;
  courses: TeacherCourse[];
  totalStudents: number;
  totalCourses: number;
}

export interface TeacherCourse {
  courseId: string;
  courseTitle: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  studentCount: number;
  startDate: Date;
  endDate: Date;
}

export interface TeacherFilters {
  search?: string;
  isActive?: boolean;
  specialization?: string;
}

export interface TeacherListResponse {
  teachers: TeacherProfile[];
  total: number;
  page: number;
  limit: number;
}
