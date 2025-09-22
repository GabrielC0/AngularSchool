import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalStateService } from '../services/global-state.service';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private globalState: GlobalStateService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.shouldSkipLoading(req)) {
      return next.handle(req);
    }

    this.activeRequests++;
    this.globalState.setLoading('http', true);
    this.globalState.incrementHttpRequests();

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.globalState.setLoading('http', false);
        }
        this.globalState.decrementHttpRequests();
      })
    );
  }

  private shouldSkipLoading(req: HttpRequest<unknown>): boolean {

    return req.url.includes('/health') || req.url.includes('/ping') || req.method === 'HEAD';
  }
}
