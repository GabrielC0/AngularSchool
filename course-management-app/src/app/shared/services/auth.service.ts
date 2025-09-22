import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService, UserRole } from './app-state.service';

interface StoredUser {
  username: string;
  password: string;
  role: UserRole;
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'users_store';

  constructor(private state: AppStateService, private router: Router) {}


  login(username: string, password: string): boolean {
    console.log('Login attempt for:', username);
    

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log('Admin login successful');
      this.state.signInAs('admin', username);
      return true;
    }

    const user = this.findUser(username);
    console.log('Found user:', user);
    
    if (user && user.password === password) {

      if (user.role === 'user') {
        console.log('Legacy role detected, fixing user role to student');
        user.role = 'student';
        this.updateUserRole(user.username, 'student');
      }
      
      console.log('User login successful:', user.role, user.username);
      this.state.signInAs(user.role, user.username);
      return true;
    }
    
    console.log('Login failed');
    return false;
  }

  register(
    username: string,
    password: string,
    role: UserRole = 'student'
  ): { success: boolean; message?: string } {
    if (!username || !password) return { success: false, message: 'Identifiants requis' };
    if (username === ADMIN_CREDENTIALS.username)
      return { success: false, message: "Nom d'utilisateur réservé" };

    const users = this.getUsers();
    console.log('Current users before registration:', users);
    
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Utilisateur déjà existant' };
    }
    
    const newUser = { username, password, role };
    users.push(newUser);
    this.setUsers(users);
    
    console.log('New user added:', newUser);
    console.log('Users after registration:', this.getUsers());
    
    return { success: true };
  }

  logout(): void {
    this.state.signOut();
    this.router.navigate(['/auth']);
  }

  getCurrentRole(): UserRole {
    return this.state.role();
  }


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

    }
  }

  private findUser(username: string): StoredUser | undefined {
    return this.getUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  private updateUserRole(username: string, newRole: UserRole): void {
    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex !== -1) {
      users[userIndex].role = newRole;
      this.setUsers(users);
      console.log(`Updated role for ${username} to ${newRole}`);
    }
  }
}
