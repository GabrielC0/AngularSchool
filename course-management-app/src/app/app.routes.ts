import { Routes } from '@angular/router';
import { StudentGuard } from './shared/guards/student.guard';
import { AdminOnlyGuard } from './shared/guards/admin-only.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AdminOnlyGuard],
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'student',
    canActivate: [StudentGuard],
    loadComponent: () =>
      import('./features/student/student-planning.component').then(
        (m) => m.StudentPlanningComponent
      ),
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'courses',
    canActivate: [AdminOnlyGuard],
    loadChildren: () => import('./features/courses/courses.routes').then((m) => m.coursesRoutes),
  },
  {
    path: 'professors',
    canActivate: [AdminOnlyGuard],
    loadComponent: () =>
      import('./features/courses/components/professors/professors.component').then(
        (m) => m.ProfessorsComponent
      ),
  },
  {
    path: 'reports',
    canActivate: [AdminOnlyGuard],
    loadComponent: () =>
      import('./features/reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
