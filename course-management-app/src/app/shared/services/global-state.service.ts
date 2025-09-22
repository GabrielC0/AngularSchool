import { Injectable, signal, computed, effect } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {

  private readonly _loadingStates = signal<Record<string, boolean>>({});
  private readonly _errorMessages = signal<string[]>([]);
  private readonly _httpRequests = signal<number>(0);
  private readonly _userActivity = signal<number>(0);
  private readonly _systemMetrics = signal({
    memoryUsage: 25,
    cpuUsage: 15,
    responseTime: 30,
  });


  readonly isLoading = computed(() => {
    const states = this._loadingStates();
    return Object.values(states).some((loading) => loading);
  });

  readonly hasErrors = computed(() => {
    return this._errorMessages().length > 0;
  });

  readonly systemHealth = computed(() => {
    const metrics = this._systemMetrics();
    const score = 100 - (metrics.memoryUsage + metrics.cpuUsage + metrics.responseTime / 10);
    return Math.max(0, Math.min(100, score));
  });

  readonly activityLevel = computed(() => {
    const activity = this._userActivity();
    if (activity > 50) return 'High';
    if (activity > 20) return 'Medium';
    return 'Low';
  });

  readonly totalHttpRequests = computed(() => this._httpRequests());

  constructor() {

    effect(() => {
      const health = this.systemHealth();

      if (health < 10) {
        console.warn('⚠️ System health is critically low:', health);
      }
    });


    effect(() => {
      const activity = this._userActivity();
      if (activity > 100) {
        console.log('📊 High user activity detected:', activity);
      }
    });



  }


  setLoading(key: string, loading: boolean): void {
    this._loadingStates.update((states) => ({
      ...states,
      [key]: loading,
    }));
  }

  getLoading(key: string): boolean {
    return this._loadingStates()[key] || false;
  }


  addError(message: string): void {
    this._errorMessages.update((errors) => [...errors, message]);
  }

  clearErrors(): void {
    this._errorMessages.set([]);
  }

  getErrors(): string[] {
    return this._errorMessages();
  }


  incrementHttpRequests(): void {
    this._httpRequests.update((count) => count + 1);
  }

  decrementHttpRequests(): void {
    this._httpRequests.update((count) => Math.max(0, count - 1));
  }


  recordUserActivity(): void {
    this._userActivity.update((activity) => activity + 1);


    setTimeout(() => {
      this._userActivity.update((activity) => Math.max(0, activity - 1));
    }, 5000);
  }


  updateSystemMetrics(
    metrics: Partial<{ memoryUsage: number; cpuUsage: number; responseTime: number }>
  ): void {
    this._systemMetrics.update((current) => ({
      ...current,
      ...metrics,
    }));
  }

  getSystemMetrics() {
    return this._systemMetrics();
  }


  private startSystemMonitoring(): void {
    setInterval(() => {

      const memoryUsage = Math.random() * 100;
      const cpuUsage = Math.random() * 100;
      const responseTime = Math.random() * 200;

      this.updateSystemMetrics({
        memoryUsage,
        cpuUsage,
        responseTime,
      });
    }, 5000);
  }


  resetAll(): void {
    this._loadingStates.set({});
    this._errorMessages.set([]);
    this._httpRequests.set(0);
    this._userActivity.set(0);
    this._systemMetrics.set({
      memoryUsage: 0,
      cpuUsage: 0,
      responseTime: 0,
    });
  }

  getStateSnapshot() {
    return {
      loadingStates: this._loadingStates(),
      errorMessages: this._errorMessages(),
      httpRequests: this._httpRequests(),
      userActivity: this._userActivity(),
      systemMetrics: this._systemMetrics(),
      isLoading: this.isLoading(),
      hasErrors: this.hasErrors(),
      systemHealth: this.systemHealth(),
      activityLevel: this.activityLevel(),
    };
  }
}
