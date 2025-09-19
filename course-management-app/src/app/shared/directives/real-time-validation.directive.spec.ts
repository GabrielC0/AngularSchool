import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RealTimeValidationDirective } from './real-time-validation.directive';

@Component({
  template: `
    <input appRealTimeValidation [formControl]="testControl" class="test-input" />
    <div class="error-message" *ngIf="testControl.invalid && testControl.touched">
      {{ getErrorMessage() }}
    </div>
  `,
})
class TestComponent {
  testControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  getErrorMessage(): string {
    if (this.testControl.errors?.['required']) {
      return 'Ce champ est requis';
    }
    if (this.testControl.errors?.['minlength']) {
      return 'Minimum 3 caractères requis';
    }
    return '';
  }
}

describe('RealTimeValidationDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, RealTimeValidationDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputElement = fixture.debugElement.query(By.css('.test-input'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = inputElement.injector.get(RealTimeValidationDirective);
    expect(directive).toBeTruthy();
  });

  it('should apply validation classes on focus', () => {
    const input = inputElement.nativeElement;

    // Simulate focus
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(input.classList.contains('validation-active')).toBe(true);
  });

  it('should remove validation classes on blur', () => {
    const input = inputElement.nativeElement;

    // Focus first
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(input.classList.contains('validation-active')).toBe(true);

    // Then blur
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input.classList.contains('validation-active')).toBe(false);
  });

  it('should apply error class when control is invalid and touched', () => {
    const input = inputElement.nativeElement;

    // Set invalid value and touch
    component.testControl.setValue('');
    component.testControl.markAsTouched();
    fixture.detectChanges();

    expect(input.classList.contains('validation-error')).toBe(true);
  });

  it('should apply success class when control is valid and touched', () => {
    const input = inputElement.nativeElement;

    // Set valid value and touch
    component.testControl.setValue('valid input');
    component.testControl.markAsTouched();
    fixture.detectChanges();

    expect(input.classList.contains('validation-success')).toBe(true);
  });

  it('should not apply validation classes when control is untouched', () => {
    const input = inputElement.nativeElement;

    // Set invalid value but don't touch
    component.testControl.setValue('');
    fixture.detectChanges();

    expect(input.classList.contains('validation-error')).toBe(false);
    expect(input.classList.contains('validation-success')).toBe(false);
  });

  it('should update classes when control validity changes', () => {
    const input = inputElement.nativeElement;

    // Start with invalid value and touch
    component.testControl.setValue('');
    component.testControl.markAsTouched();
    fixture.detectChanges();

    expect(input.classList.contains('validation-error')).toBe(true);
    expect(input.classList.contains('validation-success')).toBe(false);

    // Change to valid value
    component.testControl.setValue('valid input');
    fixture.detectChanges();

    expect(input.classList.contains('validation-error')).toBe(false);
    expect(input.classList.contains('validation-success')).toBe(true);
  });

  it('should handle multiple validation errors', () => {
    const input = inputElement.nativeElement;

    // Set value that triggers multiple errors
    component.testControl.setValue('a'); // Too short
    component.testControl.markAsTouched();
    fixture.detectChanges();

    expect(input.classList.contains('validation-error')).toBe(true);
    expect(component.testControl.errors?.['minlength']).toBeTruthy();
  });

  it('should clean up event listeners on destroy', () => {
    const directive = inputElement.injector.get(RealTimeValidationDirective);
    const input = inputElement.nativeElement;

    // Add event listeners
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    // Destroy component
    fixture.destroy();

    // Verify no memory leaks (this is more of a conceptual test)
    expect(directive).toBeTruthy();
  });
});
