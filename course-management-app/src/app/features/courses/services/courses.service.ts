import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../shared/services/base-api.service';
import { CourseCreateRequest, CourseListResponse } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService extends BaseApiService {
  createCourse(payload: CourseCreateRequest): Observable<void> {
    return this.post<void>('/courses', payload);
  }

  listCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<CourseListResponse> {
    return this.get<CourseListResponse>('/courses', params);
  }
}
