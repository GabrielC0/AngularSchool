import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Custom directive for real-time form validation
 * Adds visual feedback and error messages to form controls
 */
@Directive({
  selector: '[appRealTimeValidation]',
  standalone: true
})
export class RealTimeValidationDirective implements OnInit, OnDestroy {
  
  @Input() errorMessage: string = '';
  @Input() showErrorOnBlur: boolean = true;
  @Input() showErrorOnType: boolean = false;
  
  private destroy$ = new Subject<void>();
  private errorElement: HTMLElement | null = null;
  private isFocused: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private ngControl: NgControl
  ) {}

  ngOnInit(): void {
    this.setupValidation();
    this.subscribeToControlChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupErrorElement();
  }

  /**
   * Setup initial validation styling and event listeners
   */
  private setupValidation(): void {
    const element = this.elementRef.nativeElement;
    
    // Add base validation classes
    this.renderer.addClass(element, 'validation-control');
    
    // Add focus/blur event listeners
    this.renderer.listen(element, 'focus', () => {
      this.isFocused = true;
      this.updateValidationState();
    });
    
    this.renderer.listen(element, 'blur', () => {
      this.isFocused = false;
      this.updateValidationState();
    });
    
    // Add input event listener for real-time validation
    if (this.showErrorOnType) {
      this.renderer.listen(element, 'input', () => {
        this.updateValidationState();
      });
    }
  }

  /**
   * Subscribe to form control value changes and status changes
   */
  private subscribeToControlChanges(): void {
    if (!this.ngControl.control) {
      return;
    }

    const control = this.ngControl.control;

    // Subscribe to value changes for real-time validation
    control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.showErrorOnType) {
          this.updateValidationState();
        }
      });

    // Subscribe to status changes
    control.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateValidationState();
      });
  }

  /**
   * Update the validation state and visual feedback
   */
  private updateValidationState(): void {
    const control = this.ngControl.control;
    if (!control) return;

    const element = this.elementRef.nativeElement;
    const isValid = control.valid;
    const isTouched = control.touched;
    const isDirty = control.dirty;
    const hasErrors = control.errors && Object.keys(control.errors).length > 0;

    // Determine if we should show errors
    const shouldShowError = hasErrors && (
      (this.showErrorOnBlur && !this.isFocused && (isTouched || isDirty)) ||
      (this.showErrorOnType && (isTouched || isDirty))
    );

    // Update visual state
    this.updateVisualState(element, isValid, shouldShowError || false);
    
    // Update error message
    if (shouldShowError) {
      this.showErrorMessage(control.errors);
    } else {
      this.hideErrorMessage();
    }
  }

  /**
   * Update the visual state of the form control
   */
  private updateVisualState(element: HTMLElement, isValid: boolean, hasError: boolean): void {
    // Remove existing validation classes
    this.renderer.removeClass(element, 'is-valid');
    this.renderer.removeClass(element, 'is-invalid');
    this.renderer.removeClass(element, 'is-warning');

    // Add appropriate validation class
    if (hasError) {
      this.renderer.addClass(element, 'is-invalid');
    } else if (isValid && (this.ngControl.control?.touched || this.ngControl.control?.dirty)) {
      this.renderer.addClass(element, 'is-valid');
    }
  }

  /**
   * Show error message below the form control
   */
  private showErrorMessage(errors: any): void {
    if (!errors || this.errorElement) return;

    const element = this.elementRef.nativeElement;
    const errorMessage = this.getErrorMessage(errors);
    
    if (!errorMessage) return;

    // Create error element
    this.errorElement = this.renderer.createElement('div');
    this.renderer.addClass(this.errorElement, 'validation-error');
    this.renderer.setProperty(this.errorElement, 'textContent', errorMessage);

    // Insert error element after the form control
    const parent = this.renderer.parentNode(element);
    const nextSibling = this.renderer.nextSibling(element);
    
    if (nextSibling) {
      this.renderer.insertBefore(parent, this.errorElement, nextSibling);
    } else {
      this.renderer.appendChild(parent, this.errorElement);
    }
  }

  /**
   * Hide error message
   */
  private hideErrorMessage(): void {
    this.cleanupErrorElement();
  }

  /**
   * Clean up error element
   */
  private cleanupErrorElement(): void {
    if (this.errorElement) {
      this.renderer.removeChild(
        this.renderer.parentNode(this.errorElement),
        this.errorElement
      );
      this.errorElement = null;
    }
  }

  /**
   * Get error message based on validation errors
   */
  private getErrorMessage(errors: any): string {
    if (!errors) return '';

    // Use custom error message if provided
    if (this.errorMessage) {
      return this.errorMessage;
    }

    // Generate default error messages
    const errorMessages: { [key: string]: string } = {
      required: 'Ce champ est requis',
      email: 'Veuillez entrer une adresse email valide',
      minlength: `Minimum ${errors.minlength.requiredLength} caractères requis`,
      maxlength: `Maximum ${errors.maxlength.requiredLength} caractères autorisés`,
      min: `La valeur doit être au moins ${errors.min.min}`,
      max: `La valeur ne peut pas dépasser ${errors.max.max}`,
      pattern: 'Le format n\'est pas valide',
      futureDate: 'La date doit être dans le futur',
      dateRange: 'La date de fin doit être après la date de début',
      timeRange: 'L\'heure de fin doit être après l\'heure de début',
      minSchedule: 'Au moins un créneau horaire est requis'
    };

    // Return the first error message found
    for (const errorKey of Object.keys(errors)) {
      if (errorMessages[errorKey]) {
        return errorMessages[errorKey];
      }
    }

    return 'Valeur invalide';
  }
}
