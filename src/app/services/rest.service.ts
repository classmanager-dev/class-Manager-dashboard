import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable, of, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment.staging";
import { FormGroup, } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from '@ngx-translate/core';
declare var require: any
const endpoint = environment.endpoint
@Injectable({
  providedIn: 'root'
})
export class RestService {
  cronstrue: any
  constructor(private translateService: TranslateService, private toastr: ToastrService, private http: HttpClient, public route: ActivatedRoute, public router: Router) { }
  get(url): Observable<any> {
    return this.http.get(endpoint + url, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('Get' + url)));
  }
  delete(url): Observable<any> {
    return this.http.delete(endpoint + url, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('delete' + url)));
  }
  post(url, form): Observable<any> {
    return this.http.post(endpoint + url, form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));

  }
  patch(url, form): Observable<any> {
    return this.http.patch(endpoint + url, form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit student ')));

  }
  put(url, form): Observable<any> {
    return this.http.put(endpoint + url, form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));
  }
  loggedIn() {
    return !!localStorage.getItem('token')
  }
  getDirtyValues(form: FormGroup) {
    const dirtyValues = {};
    Object.keys(form.controls).forEach(c => {
      const currentControl = form.get(c);
      if (currentControl.dirty && currentControl.status === "VALID") {
        dirtyValues[c] = currentControl.value;
      }
    });
    return dirtyValues;
  }
  justifyText(element) {
    try {
      this.cronstrue = require('cronstrue/i18n');
      var repeat = this.cronstrue.toString(element.repeat, { locale: "fr" })
      element.repeated = repeat.split(', uniquement le')[1]
      var start_at = element.start_at.split(':');
      var finish_at = element.finish_at.split(':');
      start_at.pop();
      finish_at.pop();
      var start_at_result = start_at.join(':');
      var finish_at_result = finish_at.join(':');
      element.start_at = start_at_result
      element.finish_at = finish_at_result
    } catch (error) {
      console.log();
    }
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.error instanceof ErrorEvent) {
      }
      else {
        switch (error.status) {
          case 0:
            console.log("error")
            break;
          case 400:
            this.translateService.get('Une erreur sest produite lors le traitement de votre demande').subscribe(result => {
              this.translateService.get('Erreur').subscribe(res => {
                this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            break;
          case 403:
            this.router.navigate(['403'])
            this.translateService.get('Vous navez les permission pour effectuer cette opération').subscribe(result => {
              this.translateService.get('Erreur').subscribe(res => {
                this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            break;
          case 401:
            switch (error?.error?.code) {
              case "token_not_valid":
                this.translateService.get('Les identifiants que vous fournissez sont incorrects, Veuillez se connecter encore une fois').subscribe(result => {
                  this.translateService.get('Erreur').subscribe(res => {
                    this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                    localStorage.removeItem('token')
                    localStorage.removeItem('refresh')
                    this.router.navigate(['login'])
                  })
                })
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
                break;
            }
            switch (error.error.detail) {
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
            break;
          case 404:
            if (error.error.detail === "Not found.") {
              this.translateService.get('email que vous insérer est incorrect, veuleiz esaayez encore une fois').subscribe(result => {
                this.translateService.get('Erreur').subscribe(res => {
                  this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                })
              })
            }
            break;
          case 500:
            this.translateService.get('Une erreur serveur a été parvenue, Nous allons fixer le plutot possile').subscribe(result => {
              this.translateService.get('Erreur').subscribe(res => {
                this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            break;
          case 504:
            this.translateService.get('Un probleme de connexion, Veuillez réessayer ulterieurement').subscribe(result => {
              this.translateService.get('Erreur').subscribe(res => {
                this.toastr.error(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            break;
        }
      }
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

