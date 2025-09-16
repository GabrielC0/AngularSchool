import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/courses.routes').then((m) => m.coursesRoutes),
  },
  {
    path: 'professors',
    loadComponent: () =>
      import('./features/courses/components/professors/professors.component').then(
        (m) => m.ProfessorsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
