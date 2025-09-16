import { Injectable, effect, signal, computed } from '@angular/core';

export type UserRole = 'guest' | 'user' | 'admin';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  readonly userName = signal<string | null>(null);
  readonly role = signal<UserRole>('guest');
  readonly isLoading = signal<boolean>(false);

  readonly isAuthenticated = computed(() => this.role() !== 'guest');
  readonly isAdmin = computed(() => this.role() === 'admin');

  constructor() {
    effect(() => {
      // Persist in localStorage for demo
      const snapshot = { userName: this.userName(), role: this.role() };
      try {
        localStorage.setItem('app_state', JSON.stringify(snapshot));
      } catch {}
    });

    // Hydrate
    try {
      const raw = localStorage.getItem('app_state');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.userName !== undefined) this.userName.set(parsed.userName);
        if (parsed?.role) this.role.set(parsed.role);
      }
    } catch {}
  }

  signInAs(role: UserRole, name: string): void {
    this.userName.set(name);
    this.role.set(role);
  }

  signOut(): void {
    this.userName.set(null);
    this.role.set('guest');
  }
}
