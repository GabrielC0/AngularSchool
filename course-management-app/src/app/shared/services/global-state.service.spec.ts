import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { GlobalStateService } from './global-state.service';

describe('GlobalStateService', () => {
  let service: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(GlobalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should manage loading states correctly', () => {
    // Test initial state
    expect(service.isLoading()).toBe(false);
    expect(service.getLoading('test')).toBe(false);

    // Test setting loading state
    service.setLoading('test', true);
    expect(service.getLoading('test')).toBe(true);
    expect(service.isLoading()).toBe(true);

    // Test multiple loading states
    service.setLoading('test2', true);
    expect(service.isLoading()).toBe(true);

    // Test clearing loading state
    service.setLoading('test', false);
    expect(service.getLoading('test')).toBe(false);
    expect(service.isLoading()).toBe(true); // Still loading because test2 is true

    service.setLoading('test2', false);
    expect(service.isLoading()).toBe(false);
  });

  it('should manage error messages correctly', () => {
    // Test initial state
    expect(service.hasErrors()).toBe(false);
    expect(service.getErrors()).toEqual([]);

    // Test adding errors
    service.addError('Test error 1');
    expect(service.hasErrors()).toBe(true);
    expect(service.getErrors()).toEqual(['Test error 1']);

    service.addError('Test error 2');
    expect(service.getErrors()).toEqual(['Test error 1', 'Test error 2']);

    // Test clearing errors
    service.clearErrors();
    expect(service.hasErrors()).toBe(false);
    expect(service.getErrors()).toEqual([]);
  });

  it('should track HTTP requests correctly', () => {
    // Test initial state
    expect(service.totalHttpRequests()).toBe(0);

    // Test incrementing requests
    service.incrementHttpRequests();
    expect(service.totalHttpRequests()).toBe(1);

    service.incrementHttpRequests();
    expect(service.totalHttpRequests()).toBe(2);

    // Test decrementing requests
    service.decrementHttpRequests();
    expect(service.totalHttpRequests()).toBe(1);

    // Test that count doesn't go below 0
    service.decrementHttpRequests();
    service.decrementHttpRequests();
    expect(service.totalHttpRequests()).toBe(0);
  });

  it('should track user activity correctly', () => {
    // Test initial state
    expect(service.activityLevel()).toBe('Low');

    // Test recording activity
    service.recordUserActivity();
    expect(service.activityLevel()).toBe('Low'); // Still low with 1 activity

    // Simulate high activity
    for (let i = 0; i < 25; i++) {
      service.recordUserActivity();
    }
    expect(service.activityLevel()).toBe('Medium');

    // Simulate very high activity
    for (let i = 0; i < 30; i++) {
      service.recordUserActivity();
    }
    expect(service.activityLevel()).toBe('High');
  });

  it('should compute system health correctly', () => {
    // Test with good metrics
    service.updateSystemMetrics({
      memoryUsage: 20,
      cpuUsage: 30,
      responseTime: 50,
    });
    expect(service.systemHealth()).toBeGreaterThan(50);

    // Test with poor metrics
    service.updateSystemMetrics({
      memoryUsage: 80,
      cpuUsage: 90,
      responseTime: 200,
    });
    expect(service.systemHealth()).toBeLessThan(50);
  });

  it('should provide state snapshot', () => {
    // Set some state
    service.setLoading('test', true);
    service.addError('Test error');
    service.incrementHttpRequests();
    service.recordUserActivity();

    const snapshot = service.getStateSnapshot();

    expect(snapshot.loadingStates).toEqual({ test: true });
    expect(snapshot.errorMessages).toEqual(['Test error']);
    expect(snapshot.httpRequests).toBe(1);
    expect(snapshot.userActivity).toBe(1);
    expect(snapshot.isLoading).toBe(true);
    expect(snapshot.hasErrors).toBe(true);
  });

  it('should reset all state', () => {
    // Set some state
    service.setLoading('test', true);
    service.addError('Test error');
    service.incrementHttpRequests();
    service.recordUserActivity();

    // Reset all
    service.resetAll();

    // Verify everything is reset
    expect(service.isLoading()).toBe(false);
    expect(service.hasErrors()).toBe(false);
    expect(service.totalHttpRequests()).toBe(0);
    expect(service.activityLevel()).toBe('Low');
  });
});
