import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
const endpoint = environment.endpoint
const token=localStorage.getItem('token')

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient) { }
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  getCentres(page): Observable<any> {
    return this.http.get(endpoint + '/centers/?page=' + page, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  loggedIn() {
    return !! token

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error("the error is ", error.status);
      if (error.error instanceof ErrorEvent) {
        console.log("iti s a client side error");
        
      }
      else{

        console.log("itiis a server side error");
        switch (error.status) {
            case 0:
              console.log(['noInternet'])
              break;
            case 400:
              console.log(['page403'])
              break;
            case 403:
              console.log(['/login'], { queryParams: { error: "wrong_credentials" } });
              break;
              case 401:
              console.log(['/login'], { queryParams: { error: "wrong_credentials" } });
              break;
            case 500:
              console.log(['page500'])
              break;
          }
      }
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
