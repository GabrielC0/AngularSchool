import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { RedirectService } from '../../shared/services/redirect.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4"
    >
      <div class="w-full max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
          >
            <span class="text-2xl">📚</span>
          </div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">Système de Gestion de Cours</h1>
          <p class="text-slate-600">Connectez-vous ou créez votre compte étudiant</p>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Section Connexion -->
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div class="text-center mb-6">
              <h2 class="text-xl font-semibold text-slate-800 mb-2">🔐 Connexion</h2>
              <p class="text-slate-600">Connectez-vous avec vos identifiants</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label for="username" class="block text-sm font-semibold text-slate-700 mb-2"
                  >Nom d'utilisateur</label
                >
                <input
                  id="username"
                  formControlName="username"
                  type="text"
                  class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Entrez votre nom d'utilisateur"
                />
              </div>
              <div>
                <label for="password" class="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
                <input
                  id="password"
                  formControlName="password"
                  type="password"
                  class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Entrez votre mot de passe"
                />
              </div>
              <button
                type="submit"
                class="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                [disabled]="form.invalid"
              >
                Se connecter
              </button>
            </form>

            <!-- Info Admin -->
            <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p class="text-sm text-blue-700 text-center">
                <strong>👨‍💼 Admin de démo:</strong> admin / admin123
              </p>
            </div>
          </div>

          <!-- Section Création Compte Étudiant -->
          <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div class="text-center mb-6">
              <h2 class="text-xl font-semibold text-slate-800 mb-2">🎓 Créer un compte étudiant</h2>
              <p class="text-slate-600">Choisissez vos identifiants personnels</p>
            </div>

            <div class="space-y-4">
              <div>
                <label for="studentUsername" class="block text-sm font-semibold text-slate-700 mb-2"
                  >Nom d'utilisateur</label
                >
                <input
                  id="studentUsername"
                  [(ngModel)]="studentUsername"
                  type="text"
                  class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="Choisissez votre nom d'utilisateur"
                />
              </div>
              <div>
                <label for="studentPassword" class="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
                <input
                  id="studentPassword"
                  [(ngModel)]="studentPassword"
                  type="password"
                  class="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                  placeholder="Choisissez votre mot de passe"
                />
              </div>
              <button
                type="button"
                (click)="createStudentAccount()"
                class="w-full px-4 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                [disabled]="
                  !studentUsername ||
                  studentUsername.length < 3 ||
                  !studentPassword ||
                  studentPassword.length < 3
                "
              >
                <span class="text-lg">🎓</span>
                <span>Créer mon compte étudiant</span>
              </button>
            </div>

            <!-- Info Étudiant -->
            <div class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p class="text-sm text-green-700 text-center">
                <strong>✨ Avantages:</strong> Accès à votre planning, cours et ressources
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-sm text-slate-500">Système de gestion de cours développé avec Angular</p>
        </div>
      </div>
    </div>
  `,
})
export class AuthComponent {
  form!: FormGroup;
  studentUsername: string = '';
  studentPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private redirectService: RedirectService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { username, password } = this.form.value as { username: string; password: string };

    const ok = this.auth.login(username, password);
    if (ok) {
      this.toast.success('Connecté');
      // Utiliser le service de redirection
      this.redirectService.redirectBasedOnRole();
    } else {
      this.toast.error('Identifiants invalides');
    }
  }

  /**
   * Creates a new student account with custom username and password
   * Validates input fields and automatically logs in the student after successful registration
   * Redirects to student dashboard upon successful account creation
   */
  createStudentAccount(): void {
    if (!this.studentUsername || this.studentUsername.length < 3) {
      this.toast.error("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    if (!this.studentPassword || this.studentPassword.length < 3) {
      this.toast.error('Le mot de passe doit contenir au moins 3 caractères');
      return;
    }

    // Create student account with 'student' role
    const res = this.auth.register(this.studentUsername, this.studentPassword, 'student');
    if (res.success) {
      // Automatically log in the student
      const loginSuccess = this.auth.login(this.studentUsername, this.studentPassword);
      if (loginSuccess) {
        this.toast.success(`Compte élève créé et connecté ! Bienvenue ${this.studentUsername} !`);
        this.redirectService.redirectBasedOnRole();
      } else {
        this.toast.error('Erreur lors de la connexion automatique');
      }
    } else {
      this.toast.error(res.message || 'Erreur lors de la création du compte élève');
    }
  }
}
