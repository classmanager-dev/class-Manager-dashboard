import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable, of, } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment.staging";
import { FormGroup, } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
declare var require: any
const endpoint = environment.endpoint
@Injectable({
  providedIn: 'root'
})
export class RestService {
  cronstrue: any
  constructor(private toastr: ToastrService, private http: HttpClient, public route: ActivatedRoute, public router: Router) { }
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
            console.log("error 400")
            this.toastr.error('Une erreur s\'est produite lors du traitement de votre demande', 'Erreur')
            break;
          case 403:
            this.router.navigate(['403'])
            this.toastr.error('Vous n\'avez les permission pour effectuer cette opération', 'Erreur')
            break;
          case 401:
            this.toastr.error('Vos identifians sont inccorect, Veuillez essayer encore une fois', 'Erreur')
            break;
          case 404:
            this.toastr.error('L\'élément que vous rechercher n\'existe pas', 'Erreur')
            break;
          case 500:
            console.log("error 500")
            this.toastr.error('Une erreur serveur a été parvenue, Nous allons fixer le plutot possile', 'Erreur')
            break;
          case 504:
            console.log("error 500")
            this.toastr.error('Un probleme de connexion, Veuillez essayer ulterieurement ', 'Erreur')
            break;
        }
      }
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

