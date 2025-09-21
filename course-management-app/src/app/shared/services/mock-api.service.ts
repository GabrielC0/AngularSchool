import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { GlobalStateService } from './global-state.service';

/**
 * Mock API service for simulating real API calls with delays
 * Demonstrates loading states and error handling
 */
@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  private requestCount = 0;

  constructor(private globalState: GlobalStateService) {}

  /**
   * Simulate a successful API call with random delay
   */
  simulateApiCall<T>(data: T, minDelay: number = 1000, maxDelay: number = 3000): Observable<T> {
    this.requestCount++;
    const requestId = `api-${this.requestCount}`;

    this.globalState.setLoading(requestId, true);

    const delayTime = Math.random() * (maxDelay - minDelay) + minDelay;

    return of(data).pipe(
      delay(delayTime)
      // Simulate finalize behavior
      // Note: In real implementation, you'd use finalize operator
    ) as Observable<T>;
  }

  /**
   * Simulate an API call that might fail
   */
  simulateUnreliableApiCall<T>(data: T, failureRate: number = 0.3): Observable<T> {
    this.requestCount++;
    const requestId = `api-${this.requestCount}`;

    this.globalState.setLoading(requestId, true);

    const delayTime = Math.random() * 2000 + 1000;

    return new Observable<T>((observer) => {
      setTimeout(() => {
        this.globalState.setLoading(requestId, false);

        if (Math.random() < failureRate) {
          observer.error(new Error('Simulated API failure'));
        } else {
          observer.next(data);
          observer.complete();
        }
      }, delayTime);
    });
  }

  /**
   * Simulate paginated data
   */
  simulatePaginatedData<T>(
    data: T[],
    page: number = 1,
    pageSize: number = 10
  ): Observable<{ data: T[]; total: number; page: number; pageSize: number }> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return this.simulateApiCall({
      data: paginatedData,
      total: data.length,
      page,
      pageSize,
    });
  }

  /**
   * Simulate search functionality
   */
  simulateSearch<T>(data: T[], searchTerm: string, searchFields: Array<keyof T>): Observable<T[]> {
    const filteredData = data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    return this.simulateApiCall(filteredData, 500, 1500);
  }

  /**
   * Simulate data creation
   */
  simulateCreate<T>(data: T): Observable<T> {
    const newData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    return this.simulateApiCall(newData, 800, 2000);
  }

  /**
   * Simulate data update
   */
  simulateUpdate<T>(id: string, data: Partial<T>): Observable<T> {
    const updatedData = {
      ...data,
      id,
      updatedAt: new Date(),
    } as T;

    return this.simulateApiCall(updatedData, 600, 1800);
  }

  /**
   * Simulate data deletion
   */
  simulateDelete(id: string): Observable<{ success: boolean; id: string }> {
    return this.simulateApiCall({ success: true, id }, 400, 1200);
  }

  /**
   * Simulate batch operations
   */
  simulateBatchOperation<T>(
    items: T[],
    _operation: 'create' | 'update' | 'delete'
  ): Observable<{ success: number; failed: number; results: unknown[] }> {
    const results: unknown[] = [];
    let success = 0;
    let failed = 0;

    items.forEach((_item, index) => {
      // Simulate some failures
      if (Math.random() < 0.1) {
        // 10% failure rate
        failed++;
        results.push({ index, success: false, error: 'Simulated failure' });
      } else {
        success++;
        results.push({ index, success: true, data: _item });
      }
    });

    return this.simulateApiCall({ success, failed, results }, 2000, 5000);
  }

  /**
   * Get mock data for testing
   */
  getMockData<T>(type: string): T[] {
    switch (type) {
      case 'users':
        return [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
          { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
        ] as T[];
      case 'courses':
        return [
          { id: '1', title: 'Angular Basics', description: 'Learn Angular fundamentals' },
          { id: '2', title: 'TypeScript Advanced', description: 'Advanced TypeScript concepts' },
          { id: '3', title: 'RxJS Patterns', description: 'Reactive programming with RxJS' },
        ] as T[];
      default:
        return [];
    }
  }
}
