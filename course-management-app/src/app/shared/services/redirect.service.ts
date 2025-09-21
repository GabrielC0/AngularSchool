import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  private router = inject(Router);
  private appState = inject(AppStateService);

  /**
   * Redirect user to appropriate page based on their role
   * Called after authentication or when app loads
   */
  redirectBasedOnRole(): void {
    if (!this.appState.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }

    const role = this.appState.role();
    console.log('Redirecting based on role:', role);
    
    switch (role) {
      case 'admin':
        this.router.navigate(['/']);
        break;
      case 'student':
        this.router.navigate(['/student']);
        break;
      case 'user':
        // Legacy role - treat as student
        console.log('Legacy user role detected, redirecting to student page');
        this.router.navigate(['/student']);
        break;
      default:
        console.log('Unknown role, redirecting to auth');
        this.router.navigate(['/auth']);
        break;
    }
  }

  /**
   * Check if user should be redirected and redirect if necessary
   * Useful for checking on app startup or route changes
   */
  checkAndRedirect(): void {
    if (this.appState.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }
}
