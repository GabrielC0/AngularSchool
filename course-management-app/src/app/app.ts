import { Component, signal } from '@angular/core';
import {
  RouterOutlet,
  RouterModule,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastContainerComponent } from './shared/components/toast-container.component';
import { inject } from '@angular/core';
import { ProfessorsService } from './features/courses/services/professors.service';
import { CoursesService } from './features/courses/services/courses.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('course-management-app');
  protected readonly isNavigating = signal(false);

  constructor(router: Router) {
    // Prefetch datasets at app start
    const profs = inject(ProfessorsService);
    const courses = inject(CoursesService);
    profs.list().subscribe();
    courses.listCourses({ page: 1, limit: 20 }).subscribe();

    router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        if (ev.url.startsWith('/courses') || ev.url.startsWith('/professors')) {
          this.isNavigating.set(true);
        }
      }
      if (
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel ||
        ev instanceof NavigationError
      ) {
        this.isNavigating.set(false);
      }
    });
  }
}
