import { HttpInterceptor, HttpHandler, HttpRequest, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import { catchError } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";
import { RestService } from "./rest.service";
import * as Sentry from "@sentry/browser";
import markerSDK from '@marker.io/browser';
import { Router } from "@angular/router";
Sentry.init({
    dsn: environment.dsn,
});

const endpoint = environment.endpoint

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {

    refreshungtoken: boolean = false
    constructor(private toastr: ToastrService, private rest: RestService, private http: HttpClient, private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request)

            .pipe(
                catchError((error: any) => {

                    let errorMessage: any = ""
                    const eventId = Sentry.captureException(error.originalError || error);
                    const widget =  markerSDK.loadWidget({
                        destination: '6155fbe4e4bd4d75f5ae1ede',
                      });
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
                                  this.router.navigate(['login'])
                            })
                            return subject.asObservable();

                        }
                        if (error.status === 403) {
                            this.router.navigate(['403'])
                            this.toastr.error('Vous n\'avez les permission pour effectuer cette opération', 'Erreur')
                        }
                        if (error.status === 400) {
                            // this.router.navigate(['403'])
                            this.toastr.error('Une erreur s\'est produite lors du traitement de votre demande', 'Erreur')
                        }
                        if (error.status===500) {
                            this.toastr.error('Une erreur serveur a été parvenue, Nous allons fixer le plutot possile', 'Erreur')

                        }
                        errorMessage = error

                    }

                    // window.alert(errorMessage);


                })

            )

    }

}