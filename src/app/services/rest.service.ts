import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { FormGroup,  } from "@angular/forms";

const endpoint = environment.endpoint
const token = localStorage.getItem('token')

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private data;
  constructor(private http: HttpClient) { }
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  getCentres(page): Observable<any> {
    return this.http.get(endpoint + '/centers/?page=' + page, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getStudents(page): Observable<any> {
    return this.http.get(endpoint + '/students/?page=' + page, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getCourses(page): Observable<any> {
    return this.http.get(endpoint + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getSessions(page): Observable<any> {
    return this.http.get(endpoint + '/sessions/?page=' + page, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getStudent(id): Observable<any> {
    return this.http.get(endpoint + '/students/' + id + "/", { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  addStudent(form): Observable<any> {
    return this.http.post(endpoint + '/students/', form, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  editStudent(form,id): Observable<any> {
    return this.http.patch(endpoint + '/students/'+id+"/", form, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('edit student ')));

  }
  addPhotos(form, user_id): Observable<any> {
    return this.http.put(endpoint + '/users/' + user_id + "/picture/", form, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  addMemership(form): Observable<any> {
    return this.http.post(endpoint + '/memberships/', form, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('add memberships')));

  }
  addCentres(form): Observable<any> {
    return this.http.post(endpoint + '/centers/', form, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  loggedIn() {
    return !!token

  }
  setData(data) {
    console.log("this is the service", data);

    this.data = data;
  }
  getDirtyValues(form: FormGroup) {
    const dirtyValues = {};
    Object.keys(form.controls).forEach(c => {
      const currentControl = form.get(c);
  
      if (currentControl.dirty &&currentControl.status==="VALID") {
        dirtyValues[c] = currentControl.value;
      }
    });
    return dirtyValues;
}
  getData() {
    let temp = this.data;
    this.clearData();
    return temp;
  }
  clearData() {
    this.data = undefined;
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error("the error is ", error.status);
      if (error.error instanceof ErrorEvent) {
        console.log("iti s a client side error");

      }
      else {

        console.log("itiis a server side error");
        switch (error.status) {
          case 0:
            console.log("error")
            break;
          case 400:
            console.log("error 400")
            break;
          case 403:
            console.log("error 403");
            break;
          case 401:
            console.log("error 401");
            break;
          case 500:
            console.log("error 500")
            break;
        }
      }
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
