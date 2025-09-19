import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminMenuComponent } from './admin-menu.component';
import { GlobalStateService } from '../../shared/services/global-state.service';
import { ToastService } from '../../shared/services/toast.service';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockGlobalState: jasmine.SpyObj<GlobalStateService>;
  let mockToast: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const globalStateSpy = jasmine.createSpyObj('GlobalStateService', [
      'setLoading',
      'incrementHttpRequests',
      'decrementHttpRequests',
      'addError',
    ]);
    const toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'info']);

    await TestBed.configureTestingModule({
      imports: [AdminMenuComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GlobalStateService, useValue: globalStateSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockGlobalState = TestBed.inject(GlobalStateService) as jasmine.SpyObj<GlobalStateService>;
    mockToast = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.counter()).toBe(0);
    expect(component.signalDemoOpen()).toBe(false);
    expect(component.isHttpLoading()).toBe(false);
    expect(component.isApiLoading()).toBe(false);
  });

  it('should increment counter', () => {
    const initialValue = component.counter();
    component.incrementCounter();
    expect(component.counter()).toBe(initialValue + 1);
  });

  it('should decrement counter', () => {
    component.incrementCounter(); // Set to 1
    component.decrementCounter();
    expect(component.counter()).toBe(0);
  });

  it('should reset counter', () => {
    component.incrementCounter();
    component.incrementCounter();
    component.resetCounter();
    expect(component.counter()).toBe(0);
  });

  it('should toggle signal demo', () => {
    const initialValue = component.signalDemoOpen();
    component.toggleSignalDemo();
    expect(component.signalDemoOpen()).toBe(!initialValue);
  });

  it('should compute double counter correctly', () => {
    component.incrementCounter();
    component.incrementCounter();
    expect(component.doubleCounter()).toBe(4);
  });

  it('should compute status correctly', () => {
    // Low status
    expect(component.status()).toBe('Low');

    // Medium status
    for (let i = 0; i < 6; i++) {
      component.incrementCounter();
    }
    expect(component.status()).toBe('Medium');

    // High status
    for (let i = 0; i < 5; i++) {
      component.incrementCounter();
    }
    expect(component.status()).toBe('High');
  });

  it('should test HTTP interceptor', async () => {
    spyOn(component, 'testHttpInterceptor').and.callThrough();

    await component.testHttpInterceptor();

    expect(mockGlobalState.setLoading).toHaveBeenCalledWith('http', true);
    expect(mockGlobalState.incrementHttpRequests).toHaveBeenCalled();
  });

  it('should test error handling', () => {
    component.testErrorHandling();
    expect(mockGlobalState.addError).toHaveBeenCalled();
  });

  it('should simulate API call', async () => {
    spyOn(component, 'simulateApiCall').and.callThrough();

    await component.simulateApiCall();

    expect(component.isApiLoading()).toBe(false);
    expect(component.apiResponse()).toBeTruthy();
  });

  it('should toggle loading state', () => {
    const initialValue = component.isLoadingDemo();
    component.toggleLoadingState();
    expect(component.isLoadingDemo()).toBe(!initialValue);
  });

  it('should run performance test', () => {
    const startTime = performance.now();
    component.runPerformanceTest();
    const endTime = performance.now();

    expect(component.performanceScore()).toBeGreaterThan(0);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete quickly
  });

  it('should clear console', () => {
    component.clearConsole();
    expect(component.consoleOutput()).toEqual(['[object Object] 🧹 Console cleared']);
  });

  it('should display admin menu sections', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain("Menu d'Administration");
    expect(compiled.querySelectorAll('.bg-blue-50').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.bg-green-50').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.bg-purple-50').length).toBeGreaterThan(0);
  });

  it('should show signal demo when toggled', () => {
    component.toggleSignalDemo();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.bg-white.rounded.border')).toBeTruthy();
  });

  it('should show loading indicators', () => {
    component.toggleLoadingState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should display system status', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Signals actifs');
    expect(compiled.textContent).toContain('Requêtes HTTP');
    expect(compiled.textContent).toContain('Erreurs');
    expect(compiled.textContent).toContain('Performance');
  });
});
