import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Course, DayOfWeek, CourseStatus } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-black mb-2">Modifier le cours</h1>
        <p class="text-gray-600">Modifiez les informations du cours sélectionné</p>
      </div>

      <div *ngIf="isLoading" class="text-center py-8">
        <div
          class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
        ></div>
        <p class="mt-2 text-gray-600">Chargement du cours...</p>
      </div>

      <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <span class="text-red-600 mr-2">⚠️</span>
          <p class="text-red-800">{{ errorMessage }}</p>
        </div>
      </div>

      <div *ngIf="course && !isLoading" class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-black mb-4">Informations du cours</h3>
            <div class="space-y-4">
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Titre</span>
                <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ course.title }}</p>
              </div>
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Description</span>
                <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {{ course.description || 'Aucune description' }}
                </p>
              </div>
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Professeur</span>
                <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {{ course.teacherName || 'Non assigné' }}
                </p>
              </div>
              <div>
                <span class="block text-sm font-medium text-gray-700 mb-1">Statut</span>
                <span
                  class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                  [class]="getStatusClass(course.status)"
                >
                  {{ getStatusLabel(course.status) }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-black mb-4">Planning</h3>
            <div *ngIf="course.schedule && course.schedule.length > 0" class="space-y-2">
              <div
                *ngFor="let schedule of course.schedule"
                class="bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <span class="font-medium text-gray-900">{{
                      schedule.dayOfWeek | titlecase
                    }}</span>
                    <span class="text-gray-600 ml-2"
                      >{{ schedule.startTime }} - {{ schedule.endTime }}</span
                    >
                  </div>
                  <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded border">
                    {{ schedule.room }}
                  </span>
                </div>
              </div>
            </div>
            <div
              *ngIf="!course.schedule || course.schedule.length === 0"
              class="text-gray-500 text-center py-4"
            >
              Aucun créneau horaire défini
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200 flex justify-between">
          <button
            (click)="goBack()"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Retour
          </button>
          <div class="space-x-3">
            <button
              (click)="editCourse()"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Modifier
            </button>
            <button
              (click)="deleteCourse()"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!course && !isLoading && !errorMessage" class="text-center py-8">
        <p class="text-gray-500">Cours non trouvé</p>
        <button
          (click)="goBack()"
          class="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Retour à la liste
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .status-active {
        @apply bg-green-100 text-green-800;
      }
      .status-draft {
        @apply bg-yellow-100 text-yellow-800;
      }
      .status-completed {
        @apply bg-blue-100 text-blue-800;
      }
      .status-cancelled {
        @apply bg-red-100 text-red-800;
      }
    `,
  ],
})
export class CourseEditComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursesService: CoursesService,
    private toast: ToastService
  ) {}

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

  private loadCourse(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    // Pour l'instant, on simule le chargement d'un cours
    // Dans une vraie app, on utiliserait: this.coursesService.getCourse(id)
    setTimeout(() => {
      this.course = {
        id: id,
        title: 'Cours de démonstration',
        description: 'Ceci est un cours de démonstration pour tester la modification',
        teacherId: 'teacher1',
        teacherName: 'Prof. Martin Dubois',
        students: [],
        startDate: new Date(),
        endDate: new Date(),
        schedule: [
          {
            id: '1',
            dayOfWeek: 'monday' as DayOfWeek,
            startTime: '09:00',
            endTime: '11:00',
            room: 'A101',
          },
          {
            id: '2',
            dayOfWeek: 'wednesday' as DayOfWeek,
            startTime: '14:00',
            endTime: '16:00',
            room: 'B205',
          },
        ],
        status: 'active' as CourseStatus,
        maxStudents: 30,
        currentStudents: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.isLoading = false;
    }, 1000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'draft':
        return 'status-draft';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-draft';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'draft':
        return 'Brouillon';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }

  editCourse(): void {
    this.toast.info('Fonctionnalité de modification en cours de développement');
  }

  deleteCourse(): void {
    if (this.course && confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.coursesService
        .deleteCourse(this.course.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toast.success('Cours supprimé avec succès');
            this.router.navigate(['/courses']);
          },
          error: (err) => {
            this.toast.error('Erreur lors de la suppression du cours');
            console.error('Delete course error', err);
          },
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
