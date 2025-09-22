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
import { AppStateService } from './shared/services/app-state.service';
import { RedirectService } from './shared/services/redirect.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule, ToastContainerComponent],
  templateUrl: './app.html',
  styles: [],
})
export class App {
  protected readonly title = signal('course-management-app');
  protected readonly isNavigating = signal(false);
  protected readonly isStudentRoute = signal(false);
  protected readonly appState = inject(AppStateService);
  private readonly redirectService = inject(RedirectService);

  constructor(router: Router) {

    const profs = inject(ProfessorsService);
    const courses = inject(CoursesService);
    profs.list().subscribe();
    courses.listCourses({ page: 1, limit: 20 }).subscribe();


    this.isStudentRoute.set(router.url?.startsWith('/student'));


    setTimeout(() => {
      this.redirectService.checkAndRedirect();
    }, 100);

    router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        if (ev.url.startsWith('/courses') || ev.url.startsWith('/professors')) {
          this.isNavigating.set(true);
        }
        this.isStudentRoute.set(ev.url.startsWith('/student'));
      }
      if (
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel ||
        ev instanceof NavigationError
      ) {
        this.isNavigating.set(false);
        if (ev instanceof NavigationEnd) {
          this.isStudentRoute.set(ev.urlAfterRedirects.startsWith('/student'));
        }
      }
    });
  }

  protected isAuthenticated(): boolean {
    return this.appState.isAuthenticated();
  }

  protected isAdmin(): boolean {
    return this.appState.isAdmin();
  }

  protected isStudent(): boolean {
    const role = this.appState.role();
    return role === 'student' || role === 'user';
  }

  protected logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.appState.signOut();

      window.location.href = '/auth';
    }
  }
}
