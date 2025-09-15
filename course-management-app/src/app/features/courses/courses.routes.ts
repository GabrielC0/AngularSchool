import { Routes } from '@angular/router';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./components/course-create/course-create.component').then(m => m.CourseCreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/course-edit/course-edit.component').then(m => m.CourseEditComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'enroll/:id',
    loadComponent: () => import('./components/course-enroll/course-enroll.component').then(m => m.CourseEnrollComponent)
  },
  {
    path: 'attendance/:id',
    loadComponent: () => import('./components/course-attendance/course-attendance.component').then(m => m.CourseAttendanceComponent)
  }
];
