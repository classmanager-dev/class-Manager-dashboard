
import { Injectable,ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'
import * as Sentry from "@sentry/browser";
import { environment } from "../../environments/environment.staging";

// Sentry.init({
//   dsn: environment.dsn,
//   environment: environment.production ? 'production' : 'staging'

// });
@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
version="1"
  constructor(private injector: Injector) { }
  handleError(error: any) {
    const router = this.injector.get(Router);
    console.log(error);
    
    const eventId = Sentry.captureException(error.originalError || error);
    if (Error instanceof HttpErrorResponse) {
    console.log(error.status);
    }
    else {
    console.error(error);
    }
    Sentry.setTag('app version',this.version)
  }
}