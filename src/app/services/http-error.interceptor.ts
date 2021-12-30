import { HttpInterceptor, HttpHandler, HttpRequest, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from "../../environments/environment.staging";
import { catchError } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";
import { RestService } from "./rest.service";
import { Router } from "@angular/router";
const endpoint = environment.endpoint

@Injectable()

export class HttpErrorInterceptor implements HttpInterceptor {

    refreshungtoken: boolean = false
    constructor(private toastr: ToastrService, private rest: RestService, private http: HttpClient, private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        return next.handle(request)

            .pipe(
                catchError((error: any) => {

                    let errorMessage: any = ""
                    if (error.error instanceof ErrorEvent) {

                        errorMessage = { error };

                    } else {
                       try {
                        if (error.status === 401) {
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
                                   this.router.navigate(['login'])
                             })
                             return subject.asObservable();
                            }
                            console.log(error);
                            
                            if (error.error.detail==="Expired account") {
                             this.toastr.error('votre compte d\'essai arrive à son terme, veuillez nous contacter pour plus d\'informations', 'Erreur')  
                         }
                         if (error.error.detail==="Incorrect password") {
                            this.toastr.error('Le mot de passe que vous insérer est incorrect, veuleiz esaayez encore une fois', 'Erreur')  
                        }
                             
                         }
                         if (error.status === 403) {
                             this.router.navigate(['403'])
                             this.toastr.error('Vous n\'avez les permission pour effectuer cette opération', 'Erreur')
                         }
                         if (error.status === 404) {
                             if (error.error.detail==="Not found.") {
                                this.toastr.error('L\'email que vous insérer est incorrect, veuleiz esaayez encore une fois', 'Erreur')
                             }
                           
                        }
                         if (error.status === 400) {
                             // this.router.navigate(['403'])
                             this.toastr.error(JSON.stringify(error.error), 'Erreur')
                             console.log(error);
                             
                         }
                         if (error.status===500) {
                             this.toastr.error('Une erreur serveur a été parvenue, Nous allons fixer le plutot possile', 'Erreur')
 
                         }
                         errorMessage = error
                       } catch (error) {
                           console.log(error);
                           
                       }

                    }

                    // window.alert(errorMessage);


                })

            )

    }

}