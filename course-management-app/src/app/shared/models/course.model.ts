import { User } from './user.model';

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacher?: User;
  students: Student[];
  startDate: Date;
  endDate: Date;
  schedule: CourseSchedule[];
  status: CourseStatus;
  maxStudents: number;
  currentStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  user?: User;
  courseId: string;
  enrollmentDate: Date;
  grade?: number;
  attendance: Attendance[];
}

export interface CourseSchedule {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: Date;
  status: AttendanceStatus;
  notes?: string;
}

export enum CourseStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused'
}
