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

    // Seuls les admins peuvent accéder à cette route
    if (role === 'admin') {
      return true;
    }

    // Si l'utilisateur n'est pas admin, rediriger selon son rôle
    if (role === 'student') {
      // Rediriger les étudiants vers leur page dédiée
      this.router.navigate(['/student']);
    } else {
      // Rediriger les utilisateurs non connectés vers l'authentification
      this.router.navigate(['/auth']);
    }

    return false;
  }
}
