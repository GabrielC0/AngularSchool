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

    // Seuls les étudiants peuvent accéder à cette route
    if (role === 'student') {
      return true;
    }

    // Si l'utilisateur n'est pas un étudiant, rediriger selon son rôle
    if (role === 'admin') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/auth']);
    }

    return false;
  }
}
