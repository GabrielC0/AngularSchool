import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Course List Component - Displays list of courses
 */
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="course-list-container">
      <div class="header">
        <h1>Liste des cours</h1>
        <a routerLink="/courses/create" class="btn btn-primary">Créer un cours</a>
      </div>
      
      <div class="courses-grid">
        <div class="course-card" *ngFor="let course of mockCourses">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description }}</p>
          <div class="course-meta">
            <span>👨‍🏫 {{ course.teacher }}</span>
            <span>🎓 {{ course.students }} étudiants</span>
            <span>📅 {{ course.schedule }}</span>
          </div>
          <div class="course-actions">
            <a [routerLink]="['/courses/view', course.id]" class="btn btn-secondary">Voir</a>
            <a [routerLink]="['/courses/edit', course.id]" class="btn btn-primary">Modifier</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .course-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .course-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
      font-size: 0.9rem;
      color: #666;
    }
    
    .course-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      text-align: center;
      flex: 1;
    }
    
    .btn-primary {
      background: #3498db;
      color: white;
    }
    
    .btn-secondary {
      background: #95a5a6;
      color: white;
    }
  `]
})
export class CourseListComponent {
  mockCourses = [
    {
      id: 1,
      title: 'Introduction à Angular',
      description: 'Apprenez les bases d\'Angular et du développement web moderne.',
      teacher: 'Prof. Martin Dubois',
      students: 25,
      schedule: 'Lundi 14h-16h'
    },
    {
      id: 2,
      title: 'JavaScript Avancé',
      description: 'Techniques avancées de JavaScript et ES6+',
      teacher: 'Prof. Sophie Laurent',
      students: 18,
      schedule: 'Mercredi 10h-12h'
    }
  ];
}
