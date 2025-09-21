import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Course, DayOfWeek, CourseStatus } from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-black mb-2">Détails du cours</h1>
        <p class="text-gray-600">Informations complètes sur le cours sélectionné</p>
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

      <div *ngIf="course && !isLoading" class="space-y-6">
        <!-- En-tête du cours -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-xl font-semibold text-black">{{ course.title }}</h2>
              <p class="text-gray-600 mt-1">{{ course.description || 'Aucune description' }}</p>
            </div>
            <span
              class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              [class]="getStatusClass(course.status)"
            >
              {{ getStatusLabel(course.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-1">Professeur</h3>
              <p class="text-gray-600">{{ course.teacherName || 'Non assigné' }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-1">Étudiants</h3>
              <p class="text-gray-600">{{ course.currentStudents }} / {{ course.maxStudents }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-1">Créé le</h3>
              <p class="text-gray-600">{{ course.createdAt | date : 'dd/MM/yyyy' }}</p>
            </div>
          </div>
        </div>

        <!-- Planning -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-black mb-4">📅 Planning des cours</h3>
          <div *ngIf="course.schedule && course.schedule.length > 0" class="space-y-3">
            <div
              *ngFor="let schedule of course.schedule"
              class="bg-blue-50 border border-blue-200 p-4 rounded-lg"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                  <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {{ schedule.dayOfWeek | titlecase }}
                  </div>
                  <div>
                    <span class="font-medium text-gray-900"
                      >{{ schedule.startTime }} - {{ schedule.endTime }}</span
                    >
                    <span class="text-gray-600 ml-2"
                      >({{ getDuration(schedule.startTime, schedule.endTime) }})</span
                    >
                  </div>
                </div>
                <div class="bg-white border border-blue-200 px-3 py-1 rounded-lg">
                  <span class="text-sm font-medium text-blue-800">📍 {{ schedule.room }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            *ngIf="!course.schedule || course.schedule.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <div class="text-4xl mb-2">📅</div>
            <p>Aucun créneau horaire défini</p>
          </div>
        </div>

        <!-- Étudiants inscrits -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-black mb-4">👥 Étudiants inscrits</h3>
          <div *ngIf="course.students && course.students.length > 0" class="space-y-2">
            <div
              *ngFor="let student of course.students"
              class="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <span class="font-medium text-gray-900">{{
                  student.studentName || 'Étudiant ' + student.studentId
                }}</span>
                <span class="text-gray-600 ml-2">(ID: {{ student.studentId }})</span>
              </div>
              <div class="text-sm text-gray-500">
                Inscrit le {{ student.enrollmentDate | date : 'dd/MM/yyyy' }}
              </div>
            </div>
          </div>
          <div
            *ngIf="!course.students || course.students.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <div class="text-4xl mb-2">👥</div>
            <p>Aucun étudiant inscrit pour le moment</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center">
          <button
            (click)="goBack()"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Retour à la liste
          </button>
          <div class="space-x-3">
            <button
              (click)="editCourse()"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              ✏️ Modifier
            </button>
            <button
              (click)="enrollStudent()"
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              ➕ Inscrire un étudiant
            </button>
            <button
              (click)="viewAttendance()"
              class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              📊 Présences
            </button>
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
export class CourseDetailComponent implements OnInit, OnDestroy {
  @Output() courseEdited = new EventEmitter<Course>();
  @Output() studentEnrolled = new EventEmitter<{ courseId: string; studentId: string }>();
  @Output() attendanceViewed = new EventEmitter<string>();
  @Output() courseDeleted = new EventEmitter<string>();

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

    // Simulation du chargement d'un cours avec des données plus complètes
    setTimeout(() => {
      this.course = {
        id: id,
        title: 'Introduction à Angular',
        description:
          'Cours complet sur le framework Angular, couvrant les concepts fondamentaux, les composants, les services, et les bonnes pratiques de développement.',
        teacherId: 'teacher1',
        teacherName: 'Prof. Martin Dubois',
        students: [
          {
            id: '1',
            studentId: 'STU001',
            studentName: 'Alice Martin',
            courseId: id,
            enrollmentDate: new Date('2024-01-15'),
            grade: 85,
            attendance: [],
          },
          {
            id: '2',
            studentId: 'STU002',
            studentName: 'Bob Dupont',
            courseId: id,
            enrollmentDate: new Date('2024-01-20'),
            grade: 78,
            attendance: [],
          },
          {
            id: '3',
            studentId: 'STU003',
            studentName: 'Claire Moreau',
            courseId: id,
            enrollmentDate: new Date('2024-02-01'),
            attendance: [],
          },
        ],
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
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
          {
            id: '3',
            dayOfWeek: 'friday' as DayOfWeek,
            startTime: '10:00',
            endTime: '12:00',
            room: 'A101',
          },
        ],
        status: 'active' as CourseStatus,
        maxStudents: 30,
        currentStudents: 3,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-01'),
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

  getDuration(startTime: string, endTime: string): string {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    const duration = end - start;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h${minutes > 0 ? minutes : ''}`;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  editCourse(): void {
    if (this.course) {
      this.courseEdited.emit(this.course);
      this.router.navigate(['/courses/edit', this.course.id]);
    }
  }

  enrollStudent(): void {
    if (this.course) {
      this.router.navigate(['/courses/enroll', this.course.id]);
    }
  }

  viewAttendance(): void {
    if (this.course) {
      this.attendanceViewed.emit(this.course.id);
      this.router.navigate(['/courses/attendance', this.course.id]);
    }
  }

  // Méthode pour émettre l'événement d'inscription d'étudiant
  onStudentEnrolled(studentId: string): void {
    if (this.course) {
      this.studentEnrolled.emit({ courseId: this.course.id, studentId });
    }
  }

  // Méthode pour émettre l'événement de suppression de cours
  onCourseDeleted(): void {
    if (this.course) {
      this.courseDeleted.emit(this.course.id);
    }
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
