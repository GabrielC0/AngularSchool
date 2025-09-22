import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-slate-800 mb-2">🔧 Menu d'Administration</h2>
        <p class="text-slate-600">Accès aux fonctionnalités avancées</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Signals Management -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-800 mb-2">📊 Gestion d'État (Signals)</h3>
          <p class="text-sm text-blue-600 mb-3">Démonstration des Signals Angular 20+</p>
          <div class="space-y-2">
            <button
              (click)="toggleSignalDemo()"
              class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {{ signalDemoOpen() ? 'Masquer' : 'Afficher' }} Démo Signals
            </button>
            <div *ngIf="signalDemoOpen()" class="mt-3 p-3 bg-white rounded border">
              <p class="text-xs text-gray-600 mb-2">Compteur: {{ counter() }}</p>
              <p class="text-xs text-gray-600 mb-2">Double: {{ doubleCounter() }}</p>
              <p class="text-xs text-gray-600 mb-2">Status: {{ status() }}</p>
              <div class="flex gap-2">
                <button
                  (click)="incrementCounter()"
                  class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  +1
                </button>
                <button
                  (click)="decrementCounter()"
                  class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                >
                  -1
                </button>
                <button
                  (click)="resetCounter()"
                  class="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- HTTP Interceptors -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 class="font-semibold text-green-800 mb-2">🌐 HTTP & Intercepteurs</h3>
          <p class="text-sm text-green-600 mb-3">Gestion des requêtes HTTP</p>
          <div class="space-y-2">
            <button
              (click)="testHttpInterceptor()"
              class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              [disabled]="isHttpLoading()"
            >
              {{ isHttpLoading() ? 'Chargement...' : 'Tester Intercepteur' }}
            </button>
            <button
              (click)="testErrorHandling()"
              class="w-full px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              Tester Gestion d'Erreurs
            </button>
          </div>
        </div>

        <!-- Tests & Debug -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 class="font-semibold text-purple-800 mb-2">🧪 Tests & Débogage</h3>
          <p class="text-sm text-purple-600 mb-3">Outils de test et performance</p>
          <div class="space-y-2">
            <button
              (click)="runPerformanceTest()"
              class="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Test de Performance
            </button>
            <button
              (click)="clearConsole()"
              class="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Nettoyer Console
            </button>
          </div>
        </div>

        <!-- API Simulation -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-semibold text-yellow-800 mb-2">🔄 Simulation API</h3>
          <p class="text-sm text-yellow-600 mb-3">Données mock avec délais</p>
          <div class="space-y-2">
            <button
              (click)="simulateApiCall()"
              class="w-full px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              [disabled]="isApiLoading()"
            >
              {{ isApiLoading() ? 'Simulation...' : 'Simuler Appel API' }}
            </button>
            <p *ngIf="apiResponse()" class="text-xs text-yellow-700 mt-2">
              Réponse: {{ apiResponse() }}
            </p>
          </div>
        </div>

        <!-- Loading States -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 class="font-semibold text-indigo-800 mb-2">⏳ États de Chargement</h3>
          <p class="text-sm text-indigo-600 mb-3">Indicateurs de progression</p>
          <div class="space-y-2">
            <button
              (click)="toggleLoadingState()"
              class="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              {{ isLoadingDemo() ? 'Arrêter' : 'Démarrer' }} Chargement
            </button>
            <div *ngIf="isLoadingDemo()" class="mt-3">
              <div class="flex items-center space-x-2">
                <div
                  class="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"
                ></div>
                <span class="text-xs text-indigo-600">Chargement en cours...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 class="font-semibold text-red-800 mb-2">📈 Statut Système</h3>
          <p class="text-sm text-red-600 mb-3">Monitoring en temps réel</p>
          <div class="space-y-1">
            <p class="text-xs text-red-700">Signals actifs: {{ activeSignals() }}</p>
            <p class="text-xs text-red-700">Requêtes HTTP: {{ httpRequests() }}</p>
            <p class="text-xs text-red-700">Erreurs: {{ errorCount() }}</p>
            <p class="text-xs text-red-700">Performance: {{ performanceScore() }}ms</p>
          </div>
        </div>
      </div>

      <!-- Console Output -->
      <div
        *ngIf="consoleOutput().length > 0"
        class="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-40 overflow-y-auto"
      >
        <div class="text-gray-400 mb-2">Console Output:</div>
        <div *ngFor="let output of consoleOutput()" class="mb-1">
          {{ output }}
        </div>
      </div>
    </div>
  `,
})
export class AdminMenuComponent {

  readonly counter = signal(0);
  readonly signalDemoOpen = signal(false);
  readonly isHttpLoading = signal(false);
  readonly isApiLoading = signal(false);
  readonly isLoadingDemo = signal(false);
  readonly httpRequests = signal(0);
  readonly errorCount = signal(0);
  readonly performanceScore = signal(0);
  readonly apiResponse = signal<string | null>(null);
  readonly consoleOutput = signal<string[]>([]);


  readonly doubleCounter = computed(() => this.counter() * 2);
  readonly status = computed(() =>
    this.counter() > 10 ? 'High' : this.counter() > 5 ? 'Medium' : 'Low'
  );
  readonly activeSignals = computed(() => {
    return [
      this.counter,
      this.signalDemoOpen,
      this.isHttpLoading,
      this.isApiLoading,
      this.isLoadingDemo,
      this.httpRequests,
      this.errorCount,
      this.performanceScore,
      this.apiResponse,
      this.consoleOutput,
    ].length;
  });

  constructor(private router: Router) {

    effect(() => {
      const count = this.counter();
      if (count > 0) {
        this.addConsoleOutput(`Counter changed to: ${count}`);
      }
    });


    effect(() => {
      const score = this.performanceScore();
      if (score > 100) {
        this.addConsoleOutput(`⚠️ Performance warning: ${score}ms`);
      }
    });
  }


  incrementCounter(): void {
    this.counter.update((value) => value + 1);
  }

  decrementCounter(): void {
    this.counter.update((value) => value - 1);
  }

  resetCounter(): void {
    this.counter.set(0);
  }

  toggleSignalDemo(): void {
    this.signalDemoOpen.update((value) => !value);
  }


  async testHttpInterceptor(): Promise<void> {
    this.isHttpLoading.set(true);
    this.httpRequests.update((value) => value + 1);

    try {

      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.addConsoleOutput('✅ HTTP Interceptor test completed');
    } catch {
      this.errorCount.update((value) => value + 1);
      this.addConsoleOutput('❌ HTTP Interceptor test failed');
    } finally {
      this.isHttpLoading.set(false);
    }
  }

  testErrorHandling(): void {
    this.errorCount.update((value) => value + 1);
    this.addConsoleOutput('🧪 Testing error handling...');

    setTimeout(() => {
      this.addConsoleOutput('❌ Simulated error handled correctly');
    }, 1000);
  }


  async simulateApiCall(): Promise<void> {
    this.isApiLoading.set(true);

    try {

      const delay = Math.random() * 2000 + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const responses = ['Success', 'Data loaded', 'Operation completed'];
      const response = responses[Math.floor(Math.random() * responses.length)];
      this.apiResponse.set(response);
      this.addConsoleOutput(`📡 API Response: ${response}`);
    } finally {
      this.isApiLoading.set(false);
    }
  }


  toggleLoadingState(): void {
    this.isLoadingDemo.update((value) => !value);
    if (this.isLoadingDemo()) {
      this.addConsoleOutput('⏳ Loading state started');

      setTimeout(() => {
        this.isLoadingDemo.set(false);
        this.addConsoleOutput('✅ Loading state completed');
      }, 3000);
    }
  }


  runPerformanceTest(): void {
    this.addConsoleOutput('🚀 Running performance test...');
    const startTime = performance.now();


    let _result = 0;
    for (let i = 0; i < 1000000; i++) {
      _result += Math.random();
    }

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    this.performanceScore.set(duration);
    this.addConsoleOutput(`⚡ Performance test completed in ${duration}ms`);
  }


  clearConsole(): void {
    this.consoleOutput.set([]);
    console.clear();
    this.addConsoleOutput('🧹 Console cleared');
  }

  private addConsoleOutput(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.consoleOutput.update((output) => [...output, `[${timestamp}] ${message}`]);
  }
}
