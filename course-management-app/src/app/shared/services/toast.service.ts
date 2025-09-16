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

  show(text: string, type: ToastType = 'info', timeoutMs: number = 3000): void {
    const toast: ToastMessage = { id: this.nextId++, text, type, timeoutMs };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);
    setTimeout(() => this.dismiss(toast.id), timeoutMs);
  }

  success(text: string, timeoutMs: number = 3000): void {
    this.show(text, 'success', timeoutMs);
  }

  error(text: string, timeoutMs: number = 4000): void {
    this.show(text, 'error', timeoutMs);
  }

  info(text: string, timeoutMs: number = 3000): void {
    this.show(text, 'info', timeoutMs);
  }

  dismiss(id: number): void {
    const remaining = this.toastsSubject.getValue().filter((t) => t.id !== id);
    this.toastsSubject.next(remaining);
  }
}
