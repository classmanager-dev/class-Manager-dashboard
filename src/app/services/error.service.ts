
import { Injectable,ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'
import * as Sentry from "@sentry/browser";
import { environment } from "../../environments/environment";
import markerSDK from '@marker.io/browser';

Sentry.init({
  dsn: environment.dsn,
});
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
    const widget =  markerSDK.loadWidget({
      destination: '6155fbe4e4bd4d75f5ae1ede',
    });
    if (Error instanceof HttpErrorResponse) {
    console.log(error.status);
    }
    else {
    console.error(error);
    }
    Sentry.setTag('app version',this.version)
  }
}