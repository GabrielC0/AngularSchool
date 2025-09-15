import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-attendance',
  standalone: true,
  imports: [CommonModule],
  template: '<div><h1>Présence au cours</h1><p>Composant de gestion de présence en cours de développement</p></div>'
})
export class CourseAttendanceComponent {}
