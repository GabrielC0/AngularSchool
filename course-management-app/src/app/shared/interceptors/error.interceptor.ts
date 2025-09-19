import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalStateService } from '../services/global-state.service';
import { ToastService } from '../services/toast.service';

/**
 * HTTP interceptor for centralized error handling
 * Catches HTTP errors and provides user-friendly messages
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private globalState: GlobalStateService, private toast: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, req);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse, req: HttpRequest<any>): void {
    let errorMessage = 'Une erreur est survenue';
    let errorType = 'error';

    switch (error.status) {
      case 0:
        errorMessage = 'Impossible de se connecter au serveur';
        errorType = 'network';
        break;
      case 400:
        errorMessage = 'Requête invalide';
        errorType = 'client';
        break;
      case 401:
        errorMessage = 'Non autorisé - Veuillez vous reconnecter';
        errorType = 'auth';
        break;
      case 403:
        errorMessage = 'Accès interdit';
        errorType = 'permission';
        break;
      case 404:
        errorMessage = 'Ressource non trouvée';
        errorType = 'notfound';
        break;
      case 408:
        errorMessage = "Délai d'attente dépassé";
        errorType = 'timeout';
        break;
      case 429:
        errorMessage = 'Trop de requêtes - Veuillez patienter';
        errorType = 'rate-limit';
        break;
      case 500:
        errorMessage = 'Erreur interne du serveur';
        errorType = 'server';
        break;
      case 502:
        errorMessage = 'Serveur temporairement indisponible';
        errorType = 'server';
        break;
      case 503:
        errorMessage = 'Service temporairement indisponible';
        errorType = 'server';
        break;
      default:
        if (error.status >= 500) {
          errorMessage = 'Erreur serveur';
          errorType = 'server';
        } else if (error.status >= 400) {
          errorMessage = 'Erreur client';
          errorType = 'client';
        }
    }

    // Add error to global state
    this.globalState.addError(`${errorType}: ${errorMessage} (${req.url})`);

    // Show toast notification
    this.toast.error(errorMessage);

    // Log error for debugging
    console.error('HTTP Error:', {
      status: error.status,
      message: error.message,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
}
