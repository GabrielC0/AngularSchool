import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../courses/services/courses.service';
import { Course, CourseSchedule } from '../../shared/models/course.model';

interface StudentEvent {
  title: string;
  time: string; // HH:mm–HH:mm
  teacher?: string;
  room?: string;
}

@Component({
  selector: 'app-student-planning',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6" [attr.aria-busy]="isLoading" aria-live="polite">
      <h1 class="text-xl font-semibold text-black mb-4">Mon planning</h1>

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

      <div *ngIf="!isLoading" class="grid grid-cols-7 gap-3">
        <div class="text-center text-gray-600" *ngFor="let d of weekDays; trackBy: trackByIndex">
          {{ d }}
        </div>
        <ng-container *ngFor="let day of calendar; trackBy: trackByIndex">
          <div class="min-h-[280px] border border-gray-200 rounded-lg p-2 bg-white">
            <div class="space-y-1 max-h-64 overflow-auto">
              <div
                *ngFor="let ev of day.events; trackBy: trackByEvent"
                class="text-xs rounded px-2 py-1"
                [ngStyle]="defaultEventStyle"
              >
                <div class="font-medium truncate" [attr.aria-label]="'Cours: ' + ev.title">
                  {{ ev.title }}
                </div>
                <div class="opacity-80">
                  {{ ev.time }} · {{ ev.teacher || '—' }} · {{ ev.room || '—' }}
                </div>
              </div>
              <div *ngIf="day.events.length === 0" class="text-xs text-gray-400">Aucun cours</div>
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

  readonly defaultEventStyle = {
    backgroundColor: '#EFF6FF',
    border: '1px solid #BFDBFE',
    color: '#1D4ED8',
  } as const;

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
}


