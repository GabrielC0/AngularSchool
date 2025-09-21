import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

/**
 * Route guard that restricts access to admin-only routes
 * Only users with 'admin' role can access protected routes
 * Redirects student users to student page and unauthenticated users to auth page
 */
@Injectable({
  providedIn: 'root',
})
export class AdminOnlyGuard implements CanActivate {
  constructor(private appState: AppStateService, private router: Router) {}

  /**
   * Determines if the current user can activate the protected route
   * @returns true if user has 'admin' role, false otherwise
   */
  canActivate(): boolean {
    const role = this.appState.role();

    // Only admins can access this route
    if (role === 'admin') {
      return true;
    }

    // Redirect non-admin users based on their role
    if (role === 'student' || role === 'user') {
      // Redirect students and legacy users to their dedicated page
      this.router.navigate(['/student']);
    } else {
      // Redirect unauthenticated users to authentication page
      this.router.navigate(['/auth']);
    }

    return false;
  }
}
