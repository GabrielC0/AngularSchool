import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService, UserRole } from './app-state.service';

interface StoredUser {
  username: string;
  password: string;
  role: UserRole; // 'user' only for registered users (admin is hardcoded)
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'users_store';

  constructor(private state: AppStateService, private router: Router) {}

  // Authentication API
  login(username: string, password: string): boolean {
    // Admin hardcoded
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      this.state.signInAs('admin', username);
      return true;
    }

    const user = this.findUser(username);
    if (user && user.password === password) {
      this.state.signInAs(user.role, user.username);
      return true;
    }
    return false;
  }

  register(username: string, password: string): { success: boolean; message?: string } {
    if (!username || !password) return { success: false, message: 'Identifiants requis' };
    if (username === ADMIN_CREDENTIALS.username)
      return { success: false, message: "Nom d'utilisateur réservé" };

    const users = this.getUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Utilisateur déjà existant' };
    }
    users.push({ username, password, role: 'user' });
    this.setUsers(users);
    return { success: true };
  }

  logout(): void {
    this.state.signOut();
    this.router.navigate(['/auth']);
  }

  // Storage helpers
  private getUsers(): StoredUser[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as StoredUser[]) : [];
    } catch {
      return [];
    }
  }

  private setUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch {
      // ignore
    }
  }

  private findUser(username: string): StoredUser | undefined {
    return this.getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
  }
}


