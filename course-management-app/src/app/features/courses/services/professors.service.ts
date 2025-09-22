import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { BaseApiService } from '../../../shared/services/base-api.service';

export interface Professor {
  id: string;
  name: string;
  createdAt: string;
}
export interface ProfessorsResponse {
  professors: Professor[];
}

@Injectable({ providedIn: 'root' })
export class ProfessorsService extends BaseApiService {
  private listCache$?: Observable<ProfessorsResponse>;

  list(forceRefresh: boolean = false): Observable<ProfessorsResponse> {
    if (!forceRefresh && this.listCache$) {
      return this.listCache$;
    }
    this.listCache$ = this.get<ProfessorsResponse>('/professors').pipe(shareReplay(1));
    return this.listCache$;
  }
  create(name: string): Observable<Professor> {
    return this.post<Professor>('/professors', { name }).pipe(
      tap(() => {

        this.listCache$ = undefined;
      })
    );
  }
  remove(id: string): Observable<void> {
    const obs = this.delete<void>(`/professors/${id}`);
    return obs.pipe(
      tap(() => {
        this.listCache$ = undefined;
      })
    );
  }
}
