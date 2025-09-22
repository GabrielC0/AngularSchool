import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  private router = inject(Router);
  private appState = inject(AppStateService);

  
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

        console.log('Legacy user role detected, redirecting to student page');
        this.router.navigate(['/student']);
        break;
      default:
        console.log('Unknown role, redirecting to auth');
        this.router.navigate(['/auth']);
        break;
    }
  }

  
  checkAndRedirect(): void {
    if (this.appState.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }
}
