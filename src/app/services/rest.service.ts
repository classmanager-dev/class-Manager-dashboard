import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { FormGroup, } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

const endpoint = environment.endpoint
var token = localStorage.getItem('token')
// const refresh = localStorage.getItem('refresh')

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private data;
  constructor(private http: HttpClient, public route: ActivatedRoute, public router: Router) { }
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  authRefresh(method: Observable<any>) {
    let result: any;
    var subject = new Subject<string>();
    this.http.post(endpoint + '/auth/token/verify/', { "token": localStorage.getItem('token') }, { observe: 'response' }).pipe().subscribe(res => {
      if (res.status === 200) {
        method.pipe(map(res => { return res; })).subscribe(results => {
          result = results;
          subject.next(result);
        })
      }
    }, err => {
      if (err.status === 401) {
        localStorage.removeItem("token")
        this.http.post(endpoint + '/auth/token/refresh/', { "refresh": localStorage.getItem('refresh') }, { observe: 'response' }).pipe().subscribe((result: any) => {
          if (result.status === 200) {
            localStorage.setItem('token', result.body.access)
            token = result.body.access
            if (localStorage.getItem('token')) {
              return method.pipe(map(res => { return res; })).subscribe(results => {
                result = results;
                subject.next(result);
              })
            }
          } //logout in case of error 
        },err=>{
          this.router.navigate(['login'])
        })
      }
    })
    return subject.asObservable();
  }

  getCentres(page): Observable<any> {
    return this.http.get(endpoint + '/centers/?page=' + page, {
      headers: { "Authorization": "Bearer " + localStorage.getItem('token'), }
    }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getTowns(page): Observable<any> {
    return this.http.get(endpoint + '/towns/?page=' + page, {
      headers: { "Authorization": "Bearer " + localStorage.getItem('token'), }
    }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getPayments(page): Observable<any> {
    return this.http.get(endpoint + '/payments/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get payments')));

  }
  getStudents(page): Observable<any> {
    return this.http.get(endpoint + '/students/?page=' + page, { headers: { "Authorization": "Bearer " + token } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get students')));
  }
  getProfessors(page): Observable<any> {
   if (localStorage.getItem('center')) {
    return this.http.get(endpoint + 'centers/'+localStorage.getItem("center")+'/teachers/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get teachers')));
   } else {
    return this.http.get(endpoint + '/teachers/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get teachers')));
   }
  }
  getCourses(page): Observable<any> {
    return this.http.get(endpoint + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getSessionsByCenter(center, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + center + '/sessions/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getSession(id): Observable<any> {
    return this.http.get(endpoint + '/sessions/' + id, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get session')));

  }
  getCourse(id): Observable<any> {
    return this.http.get(endpoint + '/courses/' + id, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get course')));

  }
  getCoursesBycenter(center, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + center + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres by Id')));

  }
  getCenterCourses(id, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + id + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centre courses')));

  }
  getSessions(page): Observable<any> {
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + 'centers/'+localStorage.getItem('center')+'/sessions/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
        map(this.extractData), catchError(this.handleError<any>('get centres'))); 
    }
    else{
      return this.http.get(endpoint + '/sessions/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
        map(this.extractData), catchError(this.handleError<any>('get centres')));
    }
  }
  getStudentsByCenter(id, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + id + "/students/?page=" + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));
  }
  // getSessionsByCenter(id): Observable<any> {
  //   return this.http.get(endpoint + '/centers/' + id+"/sessions/", { headers: { "Authorization": "Bearer " +localStorage.getItem('token') } }).pipe(
  //     map(this.extractData), catchError(this.handleError<any>('get centres')));
  // }
  getCoursesByCenter(id, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + id + "/courses/?page=" + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));
  }
  getCoursesBySession(id, page): Observable<any> {
    return this.http.get(endpoint + '/sessions/' + id + "/courses/?page=" + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));
  }
  getStudentCourses(id, page): Observable<any> {
    return this.http.get(endpoint + '/students/' + id + "/courses/?page=" + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get student courses')));
  }
  getStudent(id): Observable<any> {
    return this.http.get(endpoint + '/students/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getCurrentUser(): Observable<any> {
    return this.http.get(endpoint + '/users/current/', { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getCenter(id): Observable<any> {
    return this.http.get(endpoint + '/centers/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centre')));

  }
  getProfessor(id): Observable<any> {
    return this.http.get(endpoint + '/teachers/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get teacher')));

  }
  deleteCenter(id): Observable<any> {
    return this.http.delete(endpoint + '/centers/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('delete centre')));

  }
  deleteSession(id): Observable<any> {
    return this.http.delete(endpoint + '/sessions/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('delete session')));

  }
  deleteCourse(id): Observable<any> {
    return this.http.delete(endpoint + '/courses/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('delete session')));

  }
  deleteStudent(id): Observable<any> {
    return this.http.delete(endpoint + '/students/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('delete student')));

  }
  addStudent(form): Observable<any> {
    return this.http.post(endpoint + '/students/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  addTeacher(form): Observable<any> {
    return this.http.post(endpoint + '/teachers/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  editStudent(form, id): Observable<any> {
    return this.http.patch(endpoint + '/students/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('edit student ')));

  }
  editTeacher(form, id): Observable<any> {
    return this.http.patch(endpoint + '/teachers/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('edit student ')));

  }
  editUser(form, id): Observable<any> {
    return this.http.patch(endpoint + '/users/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('edit student ')));

  }
  addPhotos(form, user_id): Observable<any> {
    return this.http.put(endpoint + '/users/' + user_id + "/picture/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  login(form): Observable<any> {
    return this.http.post(endpoint + 'auth/token/basic/', form,).pipe(
      map(this.extractData), catchError(this.handleError<any>('login')));

  }
  addMemership(form): Observable<any> {
    return this.http.post(endpoint + '/memberships/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('add memberships')));

  }
  addCentres(form): Observable<any> {
    return this.http.post(endpoint + '/centers/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  addCourse(form): Observable<any> {
    return this.http.post(endpoint + '/courses/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('posr Course')));

  }
  editCourse(form, id): Observable<any> {
    return this.http.patch(endpoint + '/courses/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('patch Course')));

  }
  addPayment(form): Observable<any> {
    return this.http.post(endpoint + '//payments//', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('add paiment')));

  }
  editCentres(form, id): Observable<any> {
    return this.http.patch(endpoint + '/centers/' + id + '/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  addPicturesCentre(form, id): Observable<any> {
    return this.http.patch(endpoint + '/centers/' + id + '/logo/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  addSession(form): Observable<any> {
    return this.http.post(endpoint + '/sessions/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('add session')));

  }
  loggedIn() {
    return !!localStorage.getItem('token')

  }
  getQueryParams() {
    return this.route.snapshot.queryParamMap.get('center')
  }
  setData(data) {
    console.log("this is the service", data);

    this.data = data;
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
      console.error("the error is ", error);
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
