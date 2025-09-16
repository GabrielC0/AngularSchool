import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { BaseApiService } from '../../../shared/services/base-api.service';
import { CourseCreateRequest, CourseListResponse } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService extends BaseApiService {
  private listCache$?: Observable<CourseListResponse>;
  createCourse(payload: CourseCreateRequest): Observable<void> {
    return this.post<void>('/courses', payload).pipe(
      tap(() => {
        this.listCache$ = undefined;
      })
    );
  }

  listCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<CourseListResponse> {
    const isDefault = !params || (params.page === 1 && params.limit === 20 && !params.search);
    if (isDefault && this.listCache$) {
      return this.listCache$;
    }
    const obs = this.get<CourseListResponse>('/courses', params).pipe(shareReplay(1));
    if (isDefault) {
      this.listCache$ = obs;
    }
    return obs;
  }

  deleteCourse(id: string): Observable<void> {
    return this.delete<void>(`/courses/${id}`).pipe(
      tap(() => {
        this.listCache$ = undefined;
      })
    );
  }

  checkConflict(payload: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    room: string;
    teacherId: string;
  }): Observable<{ conflict: boolean; reasons?: Array<'room' | 'teacher'> }> {
    return this.post<{ conflict: boolean; reasons?: Array<'room' | 'teacher'> }>(
      `/courses/check-conflict`,
      payload
    );
  }
}
