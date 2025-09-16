import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Course } from '../../../../shared/models/course.model';

/**
 * Course List Component - Displays list of courses
 */
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="course-list-container">
      <div class="header flex items-center justify-between">
        <h1 class="text-xl font-semibold text-black">Liste des cours</h1>
        <a
          routerLink="/courses/create"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <span class="text-lg">＋</span>
          <span>Ajouter un cours</span>
        </a>
      </div>

      <div *ngIf="isLoading" class="loading">Chargement des cours...</div>
      <div *ngIf="!isLoading && errorMessage" class="error">{{ errorMessage }}</div>

      <div *ngIf="!isLoading && !errorMessage && courses.length === 0" class="empty">
        Aucun cours pour le moment. Créez-en un pour commencer.
      </div>

      <div class="courses-grid" *ngIf="!isLoading && !errorMessage && courses.length > 0">
        <div class="course-card" *ngFor="let course of courses">
          <h3>{{ formatDisplay(course.title) || 'Cours' }}</h3>
          <p *ngIf="formatDisplay(course.description) as desc">{{ desc }}</p>
          <div class="course-meta">
            <span>👨‍🏫 {{ course.teacherName || displayTeacher(course) }}</span>
            <div class="schedule-block">
              <span class="schedule-title">📅 Créneaux</span>
              <ul class="schedule-list">
                <li *ngFor="let s of course.schedule">
                  {{ s.dayOfWeek | titlecase }} · {{ s.startTime }}–{{ s.endTime }} · {{ s.room }}
                </li>
              </ul>
            </div>
          </div>
          <div class="course-actions">
            <button class="btn btn-secondary" (click)="openDelete(course.id, course.title)">
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div *ngIf="isDeleteOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" (click)="cancelDelete()"></div>
        <div
          class="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6"
        >
          <h4 class="text-lg font-semibold text-black mb-2">Confirmer la suppression</h4>
          <p class="text-sm text-gray-700 mb-4">
            Êtes-vous sûr de vouloir supprimer le cours
            <span class="font-semibold">{{ pendingCourseTitle || 'sélectionné' }}</span> ? Cette
            action est irréversible.
          </p>
          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              (click)="cancelDelete()"
            >
              Annuler
            </button>
            <button
              class="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
              (click)="confirmDelete()"
              [disabled]="isLoading"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .course-list-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 1.5rem;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }
      .loading,
      .error,
      .empty {
        margin: 1rem 0;
      }
      .error {
        color: #e74c3c;
      }
      .empty {
        color: #95a5a6;
      }

      .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
      }

      .course-card {
        background: #fff;
        padding: 0.9rem 1rem;
        border-radius: 10px;
        border: 1px solid #eaecef;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      }
      .course-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        border-color: #e1e4e8;
      }

      .course-meta {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin: 0.6rem 0 0.5rem 0;
        font-size: 0.85rem;
        color: #5f6b7a;
      }
      h3 {
        margin: 0 0 6px 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: #2c3e50;
      }
      p {
        margin: 0 0 8px 0;
        font-size: 0.88rem;
        color: #6b7280;
      }

      .schedule-block {
        margin-top: 0.1rem;
      }
      .schedule-title {
        font-weight: 600;
        display: inline-block;
        margin-bottom: 0.15rem;
        font-size: 0.8rem;
        color: #374151;
      }
      .schedule-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .schedule-list li {
        background: #f9fafb;
        border: 1px solid #eef0f2;
        border-radius: 6px;
        padding: 5px 8px;
        margin-bottom: 5px;
        color: #444;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .course-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.6rem;
      }

      .btn {
        padding: 0.4rem 0.8rem;
        border-radius: 8px;
        text-decoration: none;
        text-align: center;
        border: 1px solid #d1d5db;
        font-size: 0.85rem;
        line-height: 1;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-secondary {
        background: #fff;
        color: #e11d48;
        border-color: #f3c2cc;
      }
      .btn-secondary:hover {
        background: #fff5f7;
        border-color: #ef9aa9;
      }
    `,
  ],
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  isDeleteOpen = false;
  pendingCourseId: string | null = null;
  pendingCourseTitle: string | null = null;
  private readonly teacherLabels: { [key: string]: string } = {
    teacher1: 'Prof. Martin Dubois',
    teacher2: 'Prof. Sophie Laurent',
    teacher3: 'Prof. Pierre Moreau',
  };

  constructor(
    private coursesService: CoursesService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  private fetchCourses(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.coursesService.listCourses({ page: 1, limit: 20 }).subscribe({
      next: (res) => {
        this.courses = res.courses || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger les cours.';
        console.error('Fetch courses error', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openDelete(id: string, title?: string): void {
    this.pendingCourseId = id;
    this.pendingCourseTitle = title || null;
    this.isDeleteOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteOpen = false;
    this.pendingCourseId = null;
    this.pendingCourseTitle = null;
  }

  confirmDelete(): void {
    if (!this.pendingCourseId) return;
    const id = this.pendingCourseId;
    this.isLoading = true;
    this.coursesService.deleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter((c) => c.id !== id);
        this.isLoading = false;
        this.cancelDelete();
        this.cdr.detectChanges();
        this.toast.success('Cours supprimé');
      },
      error: (err) => {
        this.errorMessage = 'La suppression a échoué.';
        console.error('Delete course error', err);
        this.isLoading = false;
        this.cancelDelete();
        this.cdr.detectChanges();
        this.toast.error('Échec de la suppression');
      },
    });
  }

  // Back-compat: plus utilisé (remplacé par modal), gardé si besoin d'appel direct
  onDelete(id: string): void {
    this.openDelete(id);
  }

  // Nettoie l'affichage des textes: masque les valeurs qui seraient l'URL locale (http://localhost:4200/)
  formatDisplay(text?: string): string {
    if (!text) return '';
    const trimmed = text.trim();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
    const normalized = trimmed.replace(/\/+$/, '/');
    const originWithSlash = (origin + '/').toLowerCase();
    const lower = normalized.toLowerCase();
    if (lower === origin.toLowerCase() || lower === originWithSlash) {
      return '';
    }
    return trimmed;
  }

  displayTeacher(course: Course): string {
    if (course.teacherName && course.teacherName.trim().length > 0) {
      return course.teacherName;
    }
    return this.teacherLabels[course.teacherId] || course.teacherId;
  }
}
