import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HTTP_INTERCEPTORS,
    HttpClient
} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from "rxjs";
import { environment } from "../../environments/environment.staging";
import { catchError } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";
import { RestService } from "./rest.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { SharedService } from "./shared.service";
const endpoint = environment.endpoint

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {
    error: any
    refreshungtoken: boolean = false
    constructor(private sharedService:SharedService,private translateService: TranslateService, private toastr: ToastrService, private rest: RestService, private http: HttpClient, private router: Router) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {

        return next.handle(request).pipe(
            catchError((error) => {
                this.error = error
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(request, next);
                } else {
                    return throwError(error);
                }
            })
        );
    }
    handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        switch (this.error.error?.code) {
            case "token_not_valid":
                if (localStorage.getItem('token')) {
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
                        this.sharedService.changeLangage("fr")
                        this.translateService.get('Les identifiants que vous fournissez sont incorrects, Veuillez se connecter encore une fois').subscribe(result => {
                            this.translateService.get('Erreur').subscribe(res => {
                                this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                                localStorage.removeItem('token')
                                localStorage.removeItem('refresh')
                                this.router.navigate(['login'])
                            })
                        })
                    })
                    return subject.asObservable();
                }
                break;
            case "user_not_found":
                this.translateService.get('Les identifiants que vous fournissez sont incorrects, Veuillez se connecter encore une fois').subscribe(result => {
                    this.translateService.get('Erreur').subscribe(res => {
                        this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                        localStorage.removeItem('token')
                        localStorage.removeItem('refresh')
                        this.router.navigate(['login'])
                    })
                })
                break;
            default:
                console.log("that should be a toaster ");

                break;
        }
        switch (this.error.error.detail) {
            case "Expired account":
                this.translateService.get('votre compte dessai arrive à son terme, veuillez nous contacter pour plus dinformations').subscribe(result => {
                    this.translateService.get('Erreur').subscribe(res => {
                        this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                    })
                })
                break;
            case "Incorrect password":
                this.translateService.get('Le mot de passe que vous insérer est incorrect, veuleiz esaayez encore une fois').subscribe(result => {
                    this.translateService.get('Erreur').subscribe(res => {
                        this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                    })
                })
                break;
        }
    }
}