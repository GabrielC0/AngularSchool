import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProfessorsService, Professor } from '../../services/professors.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-professors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-6">
      <h1 class="text-xl font-semibold text-black mb-4">Gestion des Professeurs</h1>

      <form [formGroup]="form" (ngSubmit)="onAdd()" class="flex gap-2 mb-4">
        <input
          formControlName="name"
          type="text"
          placeholder="Nom du professeur"
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          [disabled]="form.invalid || isLoading"
        >
          Ajouter
        </button>
      </form>

      <div *ngIf="isLoading" class="text-gray-600">Chargement...</div>
      <div *ngIf="!isLoading && professors.length === 0" class="text-gray-500">
        Aucun professeur.
      </div>

      <ul class="divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white">
        <li *ngFor="let p of professors" class="flex items-center justify-between px-4 py-3">
          <span class="text-black">{{ p.name }}</span>
          <button
            class="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
            (click)="onDelete(p.id)"
            [disabled]="isLoading"
          >
            Supprimer
          </button>
        </li>
      </ul>
    </div>
  `,
})
export class ProfessorsComponent implements OnInit {
  professors: Professor[] = [];
  isLoading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ProfessorsService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({ name: ['', [Validators.required, Validators.minLength(2)]] });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.isLoading = true;
    this.api.list().subscribe({
      next: (res) => {
        this.professors = res.professors || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Chargement des profs échoué');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onAdd(): void {
    if (this.form.invalid) return;
    const name = this.form.value.name!.trim();
    this.isLoading = true;
    this.api.create(name).subscribe({
      next: () => {
        this.toast.success('Prof ajouté');
        this.form.reset();
        this.refresh();
      },
      error: () => {
        this.toast.error("Échec de l'ajout");
        this.isLoading = false;
      },
    });
  }

  onDelete(id: string): void {
    this.isLoading = true;
    this.api.remove(id).subscribe({
      next: () => {
        this.toast.success('Prof supprimé');
        this.professors = this.professors.filter((p) => p.id !== id);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Suppression échouée');
        this.isLoading = false;
      },
    });
  }
}
