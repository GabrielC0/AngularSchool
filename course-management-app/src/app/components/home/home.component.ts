import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Home Component - Landing page for the course management system
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="welcome-section">
      <h2>Bienvenue dans votre plateforme éducative</h2>
      <p>Cette application vous permet de gérer efficacement vos cours, étudiants et professeurs.</p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">👨‍🏫</div>
        <h3>Gestion des Professeurs</h3>
        <p>Créez et gérez les profils des professeurs</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎓</div>
        <h3>Gestion des Étudiants</h3>
        <p>Inscrivez et suivez vos étudiants</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📖</div>
        <h3>Gestion des Cours</h3>
        <p>Organisez vos cours et emplois du temps</p>
        <a routerLink="/courses" class="btn btn-primary">Voir les cours</a>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Suivi et Rapports</h3>
        <p>Consultez les statistiques et rapports</p>
      </div>
    </div>
  `,
  styles: [`
    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;

      h2 {
        font-size: 2rem;
        margin: 0 0 1rem 0;
        font-weight: 600;
      }

      p {
        font-size: 1.1rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 0.15);
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.3rem;
        margin: 0 0 1rem 0;
        font-weight: 600;
      }

      p {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0 0 1rem 0;
      }

      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      }
    }
  `]
})
export class HomeComponent {}