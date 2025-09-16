import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CourseCreateRequest, CourseScheduleRequest } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DayOfWeek } from '../../../../shared/models/course.model';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

/**
 * Course Create Component - Handles course creation with reactive forms
 * Features: Form validation, custom validators, error handling
 */
@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss'],
})
export class CourseCreateComponent implements OnInit, OnDestroy {
  courseForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();
  scheduleValidated = false;

  // Available days for course schedule
  readonly daysOfWeek = Object.values(DayOfWeek);

  // Time slots for course schedule
  readonly timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private coursesService: CoursesService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form with all necessary controls
   */
  private initializeForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      teacherId: ['', [Validators.required]],
      schedule: this.fb.array([], [Validators.required, this.minScheduleValidator]),
    });

    // Ensure at least one schedule entry exists by default for better UX
    if (this.scheduleFormArray.length === 0) {
      this.addSchedule();
      // Recompute validity right away so the button state updates correctly
      this.scheduleFormArray.updateValueAndValidity({ onlySelf: true });
      this.courseForm.updateValueAndValidity({ onlySelf: false });
    }
  }

  /**
   * Setup form validation and error handling
   */
  private setupFormValidation(): void {
    // Watch for form changes to clear error messages
    this.courseForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
      }
    });

    // Reset schedule validation state when any schedule control changes
    const scheduleGroup = this.scheduleFormArray;
    scheduleGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.scheduleValidated = false;
    });
  }

  /**
   * Get the schedule form array
   */
  get scheduleFormArray(): FormArray {
    return this.courseForm.get('schedule') as FormArray;
  }

  /**
   * Add a new schedule entry to the form
   */
  addSchedule(): void {
    const scheduleGroup = this.fb.group(
      {
        dayOfWeek: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        room: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      },
      { validators: this.timeRangeValidator }
    );

    this.scheduleFormArray.push(scheduleGroup);
    // Make sure validators on the array and form are re-evaluated after push
    this.scheduleFormArray.updateValueAndValidity({ onlySelf: true });
    this.courseForm.updateValueAndValidity({ onlySelf: false });
  }

  /**
   * Remove a schedule entry from the form
   */
  removeSchedule(index: number): void {
    this.scheduleFormArray.removeAt(index);
  }

  /**
   * Validate a specific schedule group explicitly
   */
  validateSchedule(index: number): void {
    const group = this.scheduleFormArray.at(index) as FormGroup | undefined;
    if (!group) return;

    Object.keys(group.controls).forEach((key) => group.get(key)?.markAsTouched());
    group.updateValueAndValidity();
    this.scheduleFormArray.updateValueAndValidity({ onlySelf: true });
    this.courseForm.updateValueAndValidity({ onlySelf: false });

    this.scheduleValidated = group.valid;
    if (this.scheduleValidated) {
      group.disable({ emitEvent: false });
      this.toast.success('Créneau validé');
    } else {
      if (group.errors?.['timeRange']) {
        this.toast.error("L'heure de fin doit être après l'heure de début");
      } else {
        this.toast.info('Veuillez corriger le créneau puis revalider');
      }
    }
  }

  /**
   * Check group-level errors (e.g., timeRange) on a schedule FormGroup
   */
  hasScheduleGroupError(index: number, errorKey: string): boolean {
    const group = this.scheduleFormArray.at(index) as FormGroup | undefined;
    if (!group) return false;
    return !!group.errors?.[errorKey] && (group.touched || group.dirty);
  }

  /**
   * Get group-level error message for a schedule FormGroup
   */
  getScheduleGroupErrorMessage(index: number): string {
    const group = this.scheduleFormArray.at(index) as FormGroup | undefined;
    if (!group || !group.errors) return '';
    if (group.errors['timeRange']) {
      return "L'heure de fin doit être après l'heure de début";
    }
    return 'Valeur invalide';
  }

  /**
   * Enable editing of a validated schedule (forces re-validation before submit)
   */
  editSchedule(index: number): void {
    const group = this.scheduleFormArray.at(index) as FormGroup | undefined;
    if (!group) return;
    group.enable({ emitEvent: true });
    this.scheduleValidated = false;
    Object.keys(group.controls).forEach((key) => group.get(key)?.markAsUntouched());
    this.toast.info('Créneau en édition - revalidez pour continuer');
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.courseForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const formValue = this.courseForm.value;
      const scheduleRaw = this.scheduleFormArray.getRawValue();
      const courseData: CourseCreateRequest = {
        title: formValue.title,
        description: formValue.description,
        teacherId: formValue.teacherId,
        schedule: (scheduleRaw || []).map((s: any) => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
        })),
      };

      // Simulate API call
      this.createCourse(courseData);
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Simulate course creation API call
   */
  private createCourse(courseData: CourseCreateRequest): void {
    this.coursesService
      .createCourse(courseData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toast.success('Cours créé avec succès');
          this.router.navigate([APP_CONSTANTS.ROUTES.COURSES]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = "Erreur lors de l'enregistrement du cours. Veuillez réessayer.";
          this.toast.error("Échec de l'enregistrement du cours");
          console.error('Create course error', err);
        },
      });
  }

  // Local toast supprimé au profit du ToastService global

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.courseForm.controls).forEach((key) => {
      const control = this.courseForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach((group) => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach((subKey) => {
              group.get(subKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  /**
   * Navigate back to courses list
   */
  onCancel(): void {
    this.router.navigate([APP_CONSTANTS.ROUTES.COURSES]);
  }

  // Custom Validators

  /**
   * Custom validator to ensure start date is in the future
   */
  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { futureDate: true };
  }

  /**
   * Custom validator to ensure end date is after start date
   */
  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return end > start ? null : { dateRange: true };
  }

  /**
   * Custom validator to ensure at least one schedule entry
   */
  private minScheduleValidator(control: AbstractControl): ValidationErrors | null {
    const scheduleArray = control as FormArray;
    return scheduleArray.length > 0 ? null : { minSchedule: true };
  }

  /**
   * Custom validator to ensure end time is after start time
   */
  private timeRangeValidator = (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startTime || !endTime) return null;

    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    return end > start ? null : { timeRange: true };
  };

  /**
   * Convert time string to minutes for comparison
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper methods for template

  /**
   * Check if a form control has an error
   */
  hasError(controlName: string, errorType: string): boolean {
    const control = this.courseForm.get(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  /**
   * Check if a schedule form group has an error
   */
  hasScheduleError(index: number, controlName: string, errorType: string): boolean {
    const scheduleGroup = this.scheduleFormArray.at(index) as FormGroup;
    const control = scheduleGroup.get(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  /**
   * Get error message for a form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.courseForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) return `${this.getFieldLabel(controlName)} est requis`;
    if (errors['minlength'])
      return `${this.getFieldLabel(controlName)} doit contenir au moins ${
        errors['minlength'].requiredLength
      } caractères`;
    if (errors['maxlength'])
      return `${this.getFieldLabel(controlName)} ne peut pas dépasser ${
        errors['maxlength'].requiredLength
      } caractères`;
    if (errors['min'])
      return `${this.getFieldLabel(controlName)} doit être au moins ${errors['min'].min}`;
    if (errors['max'])
      return `${this.getFieldLabel(controlName)} ne peut pas dépasser ${errors['max'].max}`;
    if (errors['futureDate']) return 'La date de début doit être dans le futur';
    if (errors['dateRange']) return 'La date de fin doit être après la date de début';
    if (errors['minSchedule']) return 'Au moins un créneau horaire est requis';
    if (errors['timeRange']) return "L'heure de fin doit être après l'heure de début";

    return 'Valeur invalide';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Le titre',
      description: 'La description',
      teacherId: 'Le professeur',
      startDate: 'La date de début',
      endDate: 'La date de fin',
      maxStudents: "Le nombre maximum d'étudiants",
      dayOfWeek: 'Le jour',
      startTime: "L'heure de début",
      endTime: "L'heure de fin",
      room: 'La salle',
    };
    return labels[controlName] || controlName;
  }
}
