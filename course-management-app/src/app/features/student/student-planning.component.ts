import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoursesService } from '../courses/services/courses.service';
import { Course, CourseSchedule } from '../../shared/models/course.model';
import { AppStateService } from '../../shared/services/app-state.service';
import { ToastService } from '../../shared/services/toast.service';

interface StudentEvent {
  title: string;
  time: string;
  teacher?: string;
  room?: string;
}

@Component({
  selector: 'app-student-planning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Barre de navigation pour les étudiants -->
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-800">🎓 Planning Étudiant</h1>
          <p class="text-sm text-slate-600">
            Consultez votre emploi du temps
            <span *ngIf="appState.isAuthenticated()" class="ml-2 text-blue-600 font-medium">
              • Connecté en tant qu'{{ appState.role() }}
            </span>
          </p>
        </div>
        <nav class="flex items-center gap-3">
          <button
            (click)="logout()"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 font-medium"
            title="Se déconnecter"
          >
            <span class="text-sm">🚪</span>
            <span>Déconnexion</span>
          </button>
        </nav>
      </div>
    </header>

    <div class="max-w-6xl mx-auto p-6" [attr.aria-busy]="isLoading" aria-live="polite">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-slate-800 mb-2">📅 Mon Planning</h1>
        <p class="text-slate-600">Consultez votre emploi du temps hebdomadaire</p>
      </div>

      <div
        *ngIf="isLoading"
        class="flex items-center justify-center py-10"
        role="status"
        aria-live="polite"
      >
        <span class="inline-flex items-center gap-3 text-gray-600">
          <span
            class="inline-block h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
          ></span>
          Chargement du planning...
        </span>
      </div>

      <div *ngIf="!isLoading" class="grid grid-cols-7 gap-4">
        <div
          class="text-center text-slate-600 font-semibold py-2"
          *ngFor="let d of weekDays; trackBy: trackByIndex"
        >
          {{ d }}
        </div>
        <ng-container *ngFor="let day of calendar; trackBy: trackByIndex">
          <div
            class="min-h-[300px] border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="space-y-2 max-h-72 overflow-auto">
              <div
                *ngFor="let ev of day.events; trackBy: trackByEvent"
                class="text-xs rounded-lg px-3 py-2 border-l-4 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <div
                  class="font-semibold truncate text-blue-900"
                  [attr.aria-label]="'Cours: ' + ev.title"
                >
                  {{ ev.title }}
                </div>
                <div class="text-blue-700 mt-1">
                  <div class="flex items-center gap-1">
                    <span class="text-xs">🕐</span>
                    <span>{{ ev.time }}</span>
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="text-xs">👨‍🏫</span>
                    <span>{{ ev.teacher || '—' }}</span>
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="text-xs">🏫</span>
                    <span>{{ ev.room || '—' }}</span>
                  </div>
                </div>
              </div>
              <div *ngIf="day.events.length === 0" class="text-center text-slate-400 py-8">
                <div class="text-2xl mb-2">📚</div>
                <p class="text-sm">Aucun cours</p>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
export class StudentPlanningComponent implements OnInit {
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendar: Array<{ label: string; events: StudentEvent[] }> = [];
  isLoading = true;
  private allCourses: Course[] = [];


  protected readonly appState = inject(AppStateService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  constructor(private api: CoursesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.isLoading = true;
    this.api.listCourses({ page: 1, limit: 200 }).subscribe({
      next: (res) => {
        this.allCourses = res.courses || [];
        this.rebuildCalendarFromCourses(this.allCourses);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.allCourses = [];
        this.calendar = this.weekDays.map((d) => ({ label: d, events: [] as StudentEvent[] }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private rebuildCalendarFromCourses(courses: Course[]): void {
    const days = this.weekDays.map((d) => ({ label: d, events: [] as StudentEvent[] }));
    (courses || []).forEach((c) => {
      (c.schedule || []).forEach((s: CourseSchedule) => {
        const idx = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ].indexOf(String(s.dayOfWeek));
        if (idx >= 0) {
          const ev: StudentEvent = {
            title: c.title,
            time: `${s.startTime}–${s.endTime}`,
            teacher: c.teacherName,
            room: s.room,
          };
          days[idx].events.push(ev);
        }
      });
    });
    days.forEach((d) => d.events.sort((a, b) => a.time.localeCompare(b.time)));
    this.calendar = days;
  }

  trackByIndex = (index: number) => index;
  trackByEvent = (_: number, ev: StudentEvent) => `${ev.title}-${ev.time}-${ev.teacher}-${ev.room}`;

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.appState.signOut();
      this.toast.success('Déconnexion réussie');
      this.router.navigate(['/auth']);
    }
  }
}
