import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '../courses/services/courses.service';

interface CalendarEvent {
  title: string;
  time: string; // HH:mm–HH:mm
  teacher?: string;
  room?: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <h1 class="text-xl font-semibold text-black mb-4">Suivi et Rapports</h1>
      <div class="flex items-center gap-3 mb-4">
        <div class="text-black font-semibold">Semaine</div>
        <select
          [(ngModel)]="selectedTeacher"
          class="ml-auto border border-gray-300 rounded-lg px-3 py-2"
          (ngModelChange)="onTeacherChange()"
        >
          <option value="">Tous les profs</option>
          <option *ngFor="let t of teachers" [value]="t">{{ t }}</option>
        </select>
      </div>

      <div *ngIf="isLoading" class="flex items-center justify-center py-10">
        <span class="inline-flex items-center gap-3 text-gray-600">
          <span
            class="inline-block h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
          ></span>
          Chargement des données...
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
                [ngStyle]="getStyleForTeacher(ev.teacher)"
              >
                <div class="font-medium truncate">{{ ev.title }}</div>
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
export class ReportsComponent implements OnInit {
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendar: Array<{ label: string; events: CalendarEvent[] }> = [];
  teachers: string[] = [];
  selectedTeacher = '';
  isLoading = true;
  private allCourses: any[] = [];

  // Palette douce et lisible (fond/bordure/texte)
  private colorPalette = [
    { bg: '#EEF2FF', border: '#C7D2FE', text: '#3730A3' }, // indigo
    { bg: '#ECFEFF', border: '#A5F3FC', text: '#155E75' }, // cyan
    { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' }, // green
    { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E' }, // amber
    { bg: '#FFE4E6', border: '#FDA4AF', text: '#9F1239' }, // rose
    { bg: '#FAE8FF', border: '#E9D5FF', text: '#6B21A8' }, // purple
    { bg: '#F5F5F4', border: '#E7E5E4', text: '#44403C' }, // stone
    { bg: '#ECFCCB', border: '#D9F99D', text: '#3F6212' }, // lime
  ];
  private teacherColorMap = new Map<string, number>();

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
        this.calendar = this.weekDays.map((d) => ({ label: d, events: [] as CalendarEvent[] }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onTeacherChange(): void {
    this.rebuildCalendarFromCourses(this.allCourses);
  }

  private rebuildCalendarFromCourses(courses: any[]): void {
    const days = this.weekDays.map((d) => ({ label: d, events: [] as CalendarEvent[] }));
    const teacherSet = new Set<string>();
    (courses || []).forEach((c) => {
      (c.schedule || []).forEach((s: any) => {
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
          const ev: CalendarEvent = {
            title: c.title,
            time: `${s.startTime}–${s.endTime}`,
            teacher: c.teacherName,
            room: s.room,
          };
          if (!this.selectedTeacher || ev.teacher === this.selectedTeacher) {
            days[idx].events.push(ev);
          }
          if (c.teacherName) teacherSet.add(c.teacherName);
        }
      });
    });
    this.teachers = Array.from(teacherSet).sort();
    this.teacherColorMap.clear();
    this.teachers.forEach((t, i) => this.teacherColorMap.set(t, i % this.colorPalette.length));
    days.forEach((d) => d.events.sort((a, b) => a.time.localeCompare(b.time)));
    this.calendar = days;
  }

  trackByIndex = (_: number, item: any) => item;
  trackByEvent = (_: number, ev: CalendarEvent) =>
    `${ev.title}-${ev.time}-${ev.teacher}-${ev.room}`;

  getStyleForTeacher(teacher?: string) {
    if (!teacher) {
      return { backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8' };
    }
    const idx = this.teacherColorMap.get(teacher) ?? 0;
    const c = this.colorPalette[idx];
    return { backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text };
  }
}
