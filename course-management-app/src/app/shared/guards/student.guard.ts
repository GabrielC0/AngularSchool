import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

/**
 * Route guard that restricts access to student-only routes
 * Only users with 'student' role can access protected routes
 * Redirects admin users to home page and unauthenticated users to auth page
 */
@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(private appState: AppStateService, private router: Router) {}

  /**
   * Determines if the current user can activate the protected route
   * @returns true if user has 'student' role, false otherwise
   */
  canActivate(): boolean {
    const role = this.appState.role();

    // Only students can access this route
    if (role === 'student') {
      return true;
    }

    // Redirect non-student users based on their role
    if (role === 'admin') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/auth']);
    }

    return false;
  }
}
