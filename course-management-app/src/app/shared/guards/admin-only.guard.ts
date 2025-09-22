import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';


@Injectable({
  providedIn: 'root',
})
export class AdminOnlyGuard implements CanActivate {
  constructor(private appState: AppStateService, private router: Router) {}

  
  canActivate(): boolean {
    const role = this.appState.role();


    if (role === 'admin') {
      return true;
    }


    if (role === 'student' || role === 'user') {

      this.router.navigate(['/student']);
    } else {

      this.router.navigate(['/auth']);
    }

    return false;
  }
}
