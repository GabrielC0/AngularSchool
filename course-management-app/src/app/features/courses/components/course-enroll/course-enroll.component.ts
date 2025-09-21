import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Course, CourseStatus } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-enroll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-black mb-2">Inscription au cours</h1>
        <p class="text-gray-600">Inscrivez un nouvel étudiant au cours sélectionné</p>
      </div>

      <div *ngIf="isLoading" class="text-center py-8">
        <div
          class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
        ></div>
        <p class="mt-2 text-gray-600">Chargement...</p>
      </div>

      <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <span class="text-red-600 mr-2">⚠️</span>
          <p class="text-red-800">{{ errorMessage }}</p>
        </div>
      </div>

      <div *ngIf="course && !isLoading" class="space-y-6">
        <!-- Informations du cours -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">📚 Cours sélectionné</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-medium text-blue-800">{{ course.title }}</h3>
              <p class="text-blue-600 text-sm">{{ course.description || 'Aucune description' }}</p>
            </div>
            <div class="text-sm text-blue-700">
              <p><strong>Professeur:</strong> {{ course.teacherName || 'Non assigné' }}</p>
              <p>
                <strong>Places disponibles:</strong>
                {{ course.maxStudents - course.currentStudents }} / {{ course.maxStudents }}
              </p>
            </div>
          </div>
        </div>

        <!-- Formulaire d'inscription -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-black mb-4">👤 Informations de l'étudiant</h3>

          <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="studentId" class="block text-sm font-medium text-gray-700 mb-1">
                  ID Étudiant *
                </label>
                <input
                  id="studentId"
                  type="text"
                  formControlName="studentId"
                  placeholder="Ex: STU001"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.error]="
                    hasError('studentId', 'required') || hasError('studentId', 'minlength')
                  "
                />
                <div *ngIf="hasError('studentId', 'required')" class="text-red-600 text-sm mt-1">
                  L'ID étudiant est requis
                </div>
                <div *ngIf="hasError('studentId', 'minlength')" class="text-red-600 text-sm mt-1">
                  L'ID doit contenir au moins 3 caractères
                </div>
              </div>

              <div>
                <label for="studentName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  id="studentName"
                  type="text"
                  formControlName="studentName"
                  placeholder="Ex: Jean Dupont"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.error]="
                    hasError('studentName', 'required') || hasError('studentName', 'minlength')
                  "
                />
                <div *ngIf="hasError('studentName', 'required')" class="text-red-600 text-sm mt-1">
                  Le nom est requis
                </div>
                <div *ngIf="hasError('studentName', 'minlength')" class="text-red-600 text-sm mt-1">
                  Le nom doit contenir au moins 2 caractères
                </div>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email (optionnel)
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="Ex: jean.dupont@email.com"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.error]="hasError('email', 'email')"
              />
              <div *ngIf="hasError('email', 'email')" class="text-red-600 text-sm mt-1">
                Veuillez entrer une adresse email valide
              </div>
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                formControlName="notes"
                placeholder="Informations supplémentaires sur l'étudiant..."
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                (click)="goBack()"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="enrollmentForm.invalid || isSubmitting"
                class="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span *ngIf="isSubmitting" class="flex items-center">
                  <div
                    class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  ></div>
                  Inscription...
                </span>
                <span *ngIf="!isSubmitting">✅ Inscrire l'étudiant</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Étudiants déjà inscrits -->
        <div
          *ngIf="course.students && course.students.length > 0"
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h3 class="text-lg font-semibold text-black mb-4">
            👥 Étudiants déjà inscrits ({{ course.students.length }})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              *ngFor="let student of course.students"
              class="bg-gray-50 border border-gray-200 p-3 rounded-lg"
            >
              <div class="font-medium text-gray-900">
                {{ student.studentName || 'Étudiant ' + student.studentId }}
              </div>
              <div class="text-sm text-gray-600">ID: {{ student.studentId }}</div>
              <div class="text-xs text-gray-500">
                Inscrit le {{ student.enrollmentDate | date : 'dd/MM/yyyy' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!course && !isLoading && !errorMessage" class="text-center py-8">
        <div class="text-6xl mb-4">❌</div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Cours non trouvé</h2>
        <p class="text-gray-500 mb-4">Le cours demandé n'existe pas ou a été supprimé.</p>
        <button
          (click)="goBack()"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Retour à la liste des cours
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .error {
        @apply border-red-500 ring-2 ring-red-200;
      }
    `,
  ],
})
export class CourseEnrollComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  enrollmentForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private toast: ToastService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const courseId = params.get('id');
      if (courseId) {
        this.loadCourse(courseId);
      } else {
        this.errorMessage = 'ID du cours manquant';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.enrollmentForm = this.fb.group({
      studentId: ['', [Validators.required, Validators.minLength(3)]],
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      notes: [''],
    });
  }

  private loadCourse(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Simulation du chargement d'un cours
    setTimeout(() => {
      this.course = {
        id: id,
        title: 'Introduction à Angular',
        description: 'Cours complet sur le framework Angular',
        teacherId: 'teacher1',
        teacherName: 'Prof. Martin Dubois',
        students: [
          {
            id: '1',
            studentId: 'STU001',
            studentName: 'Alice Martin',
            courseId: id,
            enrollmentDate: new Date('2024-01-15'),
            attendance: [],
          },
          {
            id: '2',
            studentId: 'STU002',
            studentName: 'Bob Dupont',
            courseId: id,
            enrollmentDate: new Date('2024-01-20'),
            attendance: [],
          },
        ],
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
        schedule: [],
        status: 'active' as CourseStatus,
        maxStudents: 30,
        currentStudents: 2,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-01'),
      };
      this.isLoading = false;
    }, 1000);
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.enrollmentForm.get(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid && this.course) {
      this.isSubmitting = true;

      const formValue = this.enrollmentForm.value;
      const _enrollmentData = {
        studentId: formValue.studentId,
        studentName: formValue.studentName,
        email: formValue.email,
        notes: formValue.notes,
        courseId: this.course.id,
      };

      // Simulation de l'inscription
      setTimeout(() => {
        this.isSubmitting = false;
        this.toast.success(
          `Étudiant ${formValue.studentName} inscrit avec succès au cours "${this.course!.title}"`
        );
        this.enrollmentForm.reset();

        // Mettre à jour la liste des étudiants
        if (this.course) {
          this.course.students.push({
            id: Date.now().toString(),
            studentId: formValue.studentId,
            studentName: formValue.studentName,
            courseId: this.course.id,
            enrollmentDate: new Date(),
            attendance: [],
          });
          this.course.currentStudents = this.course.students.length;
        }
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.enrollmentForm.controls).forEach((key) => {
      const control = this.enrollmentForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
