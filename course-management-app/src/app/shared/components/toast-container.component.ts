import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [class.success]="toast.type === 'success'"
        [class.error]="toast.type === 'error'"
        [class.info]="toast.type === 'info'"
        (click)="dismiss(toast.id)"
        role="status"
        aria-live="polite"
      >
        {{ toast.text }}
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 16px;
        right: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 9999;
      }
      .toast {
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid #95a5a6;
        color: #2c3e50;
        background: rgba(149, 165, 166, 0.15);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        min-width: 220px;
      }
      .toast.success {
        border-color: #2ecc71;
        color: #2ecc71;
        background: rgba(46, 204, 113, 0.15);
      }
      .toast.error {
        border-color: #e74c3c;
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.15);
      }
      .toast.info {
        border-color: #3498db;
        color: #3498db;
        background: rgba(52, 152, 219, 0.15);
      }
    `,
  ],
})
export class ToastContainerComponent implements OnInit {
  private readonly toastService = inject(ToastService);
  toasts: ToastMessage[] = [];

  ngOnInit(): void {
    this.toastService.toasts$.subscribe((list) => (this.toasts = list));
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
