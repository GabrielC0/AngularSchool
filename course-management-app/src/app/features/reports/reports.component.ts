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
          (ngModelChange)="buildWeek()"
        >
          <option value="">Tous les profs</option>
          <option *ngFor="let t of teachers" [value]="t">{{ t }}</option>
        </select>
      </div>

      <div class="grid grid-cols-7 gap-3">
        <div class="text-center text-gray-600" *ngFor="let d of weekDays">{{ d }}</div>
        <ng-container *ngFor="let day of calendar">
          <div class="min-h-[280px] border border-gray-200 rounded-lg p-2 bg-white">
            <div class="space-y-1 max-h-64 overflow-auto">
              <div
                *ngFor="let ev of day.events"
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
    this.buildWeek();
  }

  buildWeek(): void {
    const days = this.weekDays.map((d) => ({ label: d, events: [] as CalendarEvent[] }));
    this.api.listCourses({ page: 1, limit: 200 }).subscribe((res) => {
      const teacherSet = new Set<string>();
      (res.courses || []).forEach((c) => {
        (c.schedule || []).forEach((s) => {
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
      // Mettre à jour la map couleur de façon stable sur l'ordre alphabétique
      this.teacherColorMap.clear();
      this.teachers.forEach((t, i) => this.teacherColorMap.set(t, i % this.colorPalette.length));
      days.forEach((d) => d.events.sort((a, b) => a.time.localeCompare(b.time)));
      this.calendar = days;
      this.cdr.detectChanges();
    });
  }

  getStyleForTeacher(teacher?: string) {
    if (!teacher) {
      return { backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8' };
    }
    const idx = this.teacherColorMap.get(teacher) ?? 0;
    const c = this.colorPalette[idx];
    return { backgroundColor: c.bg, border: `1px solid ${c.border}`, color: c.text };
  }
}
