import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  timeoutMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private nextId = 1;
  private activeTimers = new Map<number, any>();

  show(text: string, type: ToastType = 'info', timeoutMs: number = 3000): void {
    // Durée max 3s et un seul toast visible à la fois
    const duration = Math.min(timeoutMs ?? 3000, 3000);
    this.clearAll();
    const toast: ToastMessage = { id: this.nextId++, text, type, timeoutMs: duration };
    this.toastsSubject.next([toast]);
    const t = setTimeout(() => this.dismiss(toast.id), duration);
    this.activeTimers.set(toast.id, t);
  }

  success(text: string, timeoutMs: number = 3000): void {
    this.show(text, 'success', timeoutMs);
  }

  error(text: string, timeoutMs: number = 3000): void {
    this.show(text, 'error', timeoutMs);
  }

  info(text: string, timeoutMs: number = 3000): void {
    this.show(text, 'info', timeoutMs);
  }

  dismiss(id: number): void {
    const timer = this.activeTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.activeTimers.delete(id);
    }
    const remaining = this.toastsSubject.getValue().filter((t) => t.id !== id);
    this.toastsSubject.next(remaining);
  }

  private clearAll(): void {
    for (const t of this.activeTimers.values()) {
      clearTimeout(t);
    }
    this.activeTimers.clear();
    this.toastsSubject.next([]);
  }
}
