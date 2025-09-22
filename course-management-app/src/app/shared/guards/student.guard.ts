import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';


@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(private appState: AppStateService, private router: Router) {}

  
  canActivate(): boolean {
    const role = this.appState.role();


    if (role === 'student' || role === 'user') {
      return true;
    }


    if (role === 'admin') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/auth']);
    }

    return false;
  }
}
