import { HttpInterceptor, HttpHandler, HttpRequest, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import { catchError } from 'rxjs/operators';
import { RestService } from "./rest.service";
import * as Sentry from "@sentry/browser";
Sentry.init({
    dsn: environment.dsn,
});

const endpoint = environment.endpoint

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {

    refreshungtoken: boolean = false
    constructor(private rest: RestService, private http: HttpClient) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request)

            .pipe(
                catchError((error: any) => {

                    let errorMessage: any = ""
                    const eventId = Sentry.captureException(error.originalError || error);
                    console.log(eventId);
                    console.log(error);
                    
                    if (error.error instanceof ErrorEvent) {

                        errorMessage = { error };

                    } else {
                        if (error.status === 401) {
                            let resulta: any;
                            var subject = new Subject<string>();
                            localStorage.removeItem("token")
                            this.http.post(endpoint + '/auth/token/refresh/', { "refresh": localStorage.getItem('refresh') }, { observe: 'response' }).pipe().subscribe((result: any) => {
                                if (result.status === 200) {
                                    localStorage.setItem('token', result.body.access)
                                    request = request.clone({
                                        setHeaders: { Authorization: "Bearer " + result.body.access }
                                    });
                                    console.log(next.handle(request));
                                    return next.handle(request).pipe().subscribe(results => {
                                        resulta = results;
                                        subject.next(resulta);
                                    })
                                } //logout in case of error 
                            }, err => {
                                //   this.router.navigate(['login'])
                            })

                        }
                        //    const eventId = Sentry.captureException(error.originalError || error);

                        errorMessage = error

                    }

                    // window.alert(errorMessage);
                    return subject.asObservable();


                })

            )

    }

}