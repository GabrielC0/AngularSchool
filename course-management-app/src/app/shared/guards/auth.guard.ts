import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

export const authGuard: CanActivateFn = () => {
  const state = inject(AppStateService);
  const router = inject(Router);
  if (state.isAuthenticated()) return true;
  router.navigate(['/']);
  return false;
};
