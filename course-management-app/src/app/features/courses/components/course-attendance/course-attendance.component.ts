import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../shared/services/toast.service';
import {
  Course,
  AttendanceStatus,
  Student,
  Attendance,
  CourseStatus,
} from '../../../../shared/models/course.model';

@Component({
  selector: 'app-course-attendance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-black mb-2">Gestion des présences</h1>
        <p class="text-gray-600">Suivez et gérez les présences des étudiants pour ce cours</p>
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
        <div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h2 class="text-lg font-semibold text-purple-900 mb-2">📊 Cours sélectionné</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 class="font-medium text-purple-800">{{ course.title }}</h3>
              <p class="text-purple-600 text-sm">{{ course.teacherName || 'Non assigné' }}</p>
            </div>
            <div class="text-sm text-purple-700">
              <p><strong>Étudiants inscrits:</strong> {{ course.currentStudents }}</p>
              <p><strong>Statut:</strong> {{ getStatusLabel(course.status) }}</p>
            </div>
            <div class="text-sm text-purple-700">
              <p><strong>Début:</strong> {{ course.startDate | date : 'dd/MM/yyyy' }}</p>
              <p><strong>Fin:</strong> {{ course.endDate | date : 'dd/MM/yyyy' }}</p>
            </div>
          </div>
        </div>

        <!-- Statistiques des présences -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="text-2xl mr-3">✅</div>
              <div>
                <p class="text-sm text-green-600">Présents</p>
                <p class="text-xl font-semibold text-green-800">
                  {{ getAttendanceCount(AttendanceStatus.PRESENT) }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="text-2xl mr-3">❌</div>
              <div>
                <p class="text-sm text-red-600">Absents</p>
                <p class="text-xl font-semibold text-red-800">
                  {{ getAttendanceCount(AttendanceStatus.ABSENT) }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="text-2xl mr-3">⏰</div>
              <div>
                <p class="text-sm text-yellow-600">En retard</p>
                <p class="text-xl font-semibold text-yellow-800">
                  {{ getAttendanceCount(AttendanceStatus.LATE) }}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center">
              <div class="text-2xl mr-3">📝</div>
              <div>
                <p class="text-sm text-blue-600">Excusés</p>
                <p class="text-xl font-semibold text-blue-800">
                  {{ getAttendanceCount(AttendanceStatus.EXCUSED) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des étudiants avec présences -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-black">👥 Liste des étudiants</h3>
            <button
              (click)="markAttendance()"
              class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              📝 Marquer les présences
            </button>
          </div>

          <div *ngIf="course.students && course.students.length > 0" class="space-y-3">
            <div
              *ngFor="let student of course.students"
              class="bg-gray-50 border border-gray-200 p-4 rounded-lg"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-4">
                  <div>
                    <h4 class="font-medium text-gray-900">
                      {{ student.studentName || 'Étudiant ' + student.studentId }}
                    </h4>
                    <p class="text-sm text-gray-600">ID: {{ student.studentId }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">Présences:</span>
                  <div class="flex space-x-1">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {{ getStudentAttendanceCount(student, AttendanceStatus.PRESENT) }} ✅
                    </span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {{ getStudentAttendanceCount(student, AttendanceStatus.ABSENT) }} ❌
                    </span>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {{ getStudentAttendanceCount(student, AttendanceStatus.LATE) }} ⏰
                    </span>
                  </div>
                </div>
              </div>

              <!-- Historique des présences récentes -->
              <div
                *ngIf="student.attendance && student.attendance.length > 0"
                class="mt-3 pt-3 border-t border-gray-200"
              >
                <p class="text-xs text-gray-500 mb-2">Dernières présences:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    *ngFor="let attendance of getRecentAttendance(student, 5)"
                    class="px-2 py-1 rounded text-xs font-medium"
                    [class]="getAttendanceClass(attendance.status)"
                  >
                    {{ attendance.date | date : 'dd/MM' }}
                    {{ getAttendanceIcon(attendance.status) }}
                  </span>
                </div>
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
            ← Retour au cours
          </button>
          <div class="space-x-3">
            <button
              (click)="exportAttendance()"
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              📊 Exporter
            </button>
            <button
              (click)="viewReports()"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              📈 Rapports
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
      .attendance-present {
        @apply bg-green-100 text-green-800;
      }
      .attendance-absent {
        @apply bg-red-100 text-red-800;
      }
      .attendance-late {
        @apply bg-yellow-100 text-yellow-800;
      }
      .attendance-excused {
        @apply bg-blue-100 text-blue-800;
      }
    `,
  ],
})
export class CourseAttendanceComponent implements OnInit, OnDestroy {
  // Exposer l'enum pour le template
  readonly AttendanceStatus = AttendanceStatus;

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

    // Simulation du chargement d'un cours avec des données de présence
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
            attendance: [
              {
                id: '1',
                studentId: 'STU001',
                courseId: id,
                date: new Date('2024-02-01'),
                status: 'present' as AttendanceStatus,
              },
              {
                id: '2',
                studentId: 'STU001',
                courseId: id,
                date: new Date('2024-02-03'),
                status: 'present' as AttendanceStatus,
              },
              {
                id: '3',
                studentId: 'STU001',
                courseId: id,
                date: new Date('2024-02-05'),
                status: 'late' as AttendanceStatus,
              },
              {
                id: '4',
                studentId: 'STU001',
                courseId: id,
                date: new Date('2024-02-08'),
                status: 'present' as AttendanceStatus,
              },
            ],
          },
          {
            id: '2',
            studentId: 'STU002',
            studentName: 'Bob Dupont',
            courseId: id,
            enrollmentDate: new Date('2024-01-20'),
            attendance: [
              {
                id: '5',
                studentId: 'STU002',
                courseId: id,
                date: new Date('2024-02-01'),
                status: 'absent' as AttendanceStatus,
              },
              {
                id: '6',
                studentId: 'STU002',
                courseId: id,
                date: new Date('2024-02-03'),
                status: 'present' as AttendanceStatus,
              },
              {
                id: '7',
                studentId: 'STU002',
                courseId: id,
                date: new Date('2024-02-05'),
                status: 'present' as AttendanceStatus,
              },
              {
                id: '8',
                studentId: 'STU002',
                courseId: id,
                date: new Date('2024-02-08'),
                status: 'excused' as AttendanceStatus,
              },
            ],
          },
          {
            id: '3',
            studentId: 'STU003',
            studentName: 'Claire Moreau',
            courseId: id,
            enrollmentDate: new Date('2024-02-01'),
            attendance: [
              {
                id: '9',
                studentId: 'STU003',
                courseId: id,
                date: new Date('2024-02-03'),
                status: 'present' as AttendanceStatus,
              },
              {
                id: '10',
                studentId: 'STU003',
                courseId: id,
                date: new Date('2024-02-05'),
                status: 'present' as AttendanceStatus,
              },
              {
                id: '11',
                studentId: 'STU003',
                courseId: id,
                date: new Date('2024-02-08'),
                status: 'present' as AttendanceStatus,
              },
            ],
          },
        ],
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
        schedule: [],
        status: 'active' as CourseStatus,
        maxStudents: 30,
        currentStudents: 3,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-01'),
      };
      this.isLoading = false;
    }, 1000);
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

  getAttendanceCount(status: AttendanceStatus): number {
    if (!this.course?.students) return 0;

    return this.course.students.reduce((total, student) => {
      return total + (student.attendance?.filter((a) => a.status === status).length || 0);
    }, 0);
  }

  getStudentAttendanceCount(student: Student, status: AttendanceStatus): number {
    return student.attendance?.filter((a: Attendance) => a.status === status).length || 0;
  }

  getRecentAttendance(student: Student, limit: number): Attendance[] {
    if (!student.attendance) return [];
    return student.attendance
      .sort(
        (a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, limit);
  }

  getAttendanceClass(status: AttendanceStatus): string {
    switch (status) {
      case 'present':
        return 'attendance-present';
      case 'absent':
        return 'attendance-absent';
      case 'late':
        return 'attendance-late';
      case 'excused':
        return 'attendance-excused';
      default:
        return 'attendance-absent';
    }
  }

  getAttendanceIcon(status: AttendanceStatus): string {
    switch (status) {
      case 'present':
        return '✅';
      case 'absent':
        return '❌';
      case 'late':
        return '⏰';
      case 'excused':
        return '📝';
      default:
        return '❓';
    }
  }

  markAttendance(): void {
    this.toast.info('Fonctionnalité de marquage des présences en cours de développement');
  }

  exportAttendance(): void {
    this.toast.info("Fonctionnalité d'export en cours de développement");
  }

  viewReports(): void {
    this.router.navigate(['/reports']);
  }

  goBack(): void {
    if (this.course) {
      this.router.navigate(['/courses/view', this.course.id]);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
