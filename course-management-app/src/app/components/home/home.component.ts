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
    <section class="text-center mb-8">
      <h2 class="text-3xl font-semibold text-black mb-2">
        Bienvenue dans votre plateforme éducative
      </h2>
      <p class="text-gray-600 max-w-xl mx-auto">
        Cette application vous permet de gérer efficacement vos cours, étudiants et professeurs.
      </p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition"
      >
        <div class="text-4xl mb-2">👨‍🏫</div>
        <h3 class="text-lg font-semibold text-black mb-1">Gestion des Professeurs</h3>
        <p class="text-sm text-gray-600 mb-2">Créez et gérez les profils des professeurs</p>
        <a
          routerLink="/professors"
          class="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >Gérer les profs</a
        >
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition"
      >
        <div class="text-4xl mb-2">📖</div>
        <h3 class="text-lg font-semibold text-black mb-1">Gestion des Cours</h3>
        <p class="text-sm text-gray-600 mb-2">Organisez vos cours et emplois du temps</p>
        <a
          routerLink="/courses"
          class="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >Voir les cours</a
        >
      </div>

      <div
        class="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm hover:shadow-md transition"
      >
        <div class="text-4xl mb-2">📊</div>
        <h3 class="text-lg font-semibold text-black mb-1">Suivi et Rapports</h3>
        <p class="text-sm text-gray-600">Consultez les statistiques et rapports</p>
      </div>
    </section>
  `,
  styles: [],
})
export class HomeComponent {}
