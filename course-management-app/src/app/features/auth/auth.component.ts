import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[60vh] flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6">
        <h1 class="text-xl font-semibold text-black mb-4 text-center">Authentification</h1>

        <div class="grid grid-cols-2 gap-2 mb-4" role="tablist">
          <button type="button" class="px-3 py-2 rounded-lg border" [class.bg-gray-100]="mode==='login'" (click)="mode='login'">Se connecter</button>
          <button type="button" class="px-3 py-2 rounded-lg border" [class.bg-gray-100]="mode==='register'" (click)="mode='register'">Créer un compte</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-3">
          <div>
            <label class="block text-sm text-gray-700 mb-1">Nom d'utilisateur</label>
            <input formControlName="username" type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-black" />
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Mot de passe</label>
            <input formControlName="password" type="password" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-black" />
          </div>
          <button type="submit" class="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" [disabled]="form.invalid">{{ mode==='login' ? 'Se connecter' : "S'inscrire" }}</button>
          <div class="text-xs text-gray-500 text-center">Admin de démo: admin / admin123</div>
        </form>
      </div>
    </div>
  `,
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { username, password } = this.form.value as { username: string; password: string };
    if (this.mode === 'login') {
      const ok = this.auth.login(username, password);
      if (ok) {
        this.toast.success('Connecté');
        this.router.navigate(['/']);
      } else {
        this.toast.error('Identifiants invalides');
      }
    } else {
      const res = this.auth.register(username, password);
      if (res.success) {
        this.toast.success('Compte créé, vous pouvez vous connecter');
        this.mode = 'login';
      } else {
        this.toast.error(res.message || 'Inscription échouée');
      }
    }
  }
}


