import { Injectable } from '@angular/core';
import { HttpClient,} from '@angular/common/http';
import { Observable, of,  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment.staging";
import { FormGroup, } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
const endpoint = environment.endpoint
var token = localStorage.getItem('token')
// const refresh = localStorage.getItem('refresh')

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private data;
  constructor(private toastr: ToastrService, private http: HttpClient, public route: ActivatedRoute, public router: Router) { }
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  getCentres(page): Observable<any> {
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
    return this.http.get(endpoint + '/centers/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('Get centers')));
  }
  getCentreStats(id,date): Observable<any> {
    return this.http.get(endpoint + '/centers/'+id+'/stats/'+date  , { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('Get centers')));
  }
  getCentresStats(id): Observable<any> {

    return this.http.get(endpoint + '/centers/' + id + "/stats", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('Get centers stats')));
  }
  getTowns(page): Observable<any> {
    return this.http.get(endpoint + '/towns/?page=' + page, {
      headers: { "Authorization": "Bearer " + localStorage.getItem('token'), }
    }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getTown(id): Observable<any> {
    return this.http.get(endpoint + '/towns/' + id, { headers: { "Authorization": "Bearer " + localStorage.getItem('token'), } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get town')));

  }
  getPayments(page): Observable<any> {
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + '/centers/' + localStorage.getItem("center") + '/payments/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
        catchError(this.handleError<any>('get payments')));
    } else {
      return this.http.get(endpoint + '/payments/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
        catchError(this.handleError<any>('get payments')));
    }

  }
  getManagers(page): Observable<any> {
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + '/centers/' + localStorage.getItem("center") + '/managers/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
        map(this.extractData), catchError(this.handleError<any>('get managers')));
    } else {
      return this.http.get(endpoint + '/managers/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
        map(this.extractData), catchError(this.handleError<any>('get managers')));
    }

  }
  getAgents(page): Observable<any> {
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + '/centers/' + localStorage.getItem("center") + '/agents/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
        map(this.extractData), catchError(this.handleError<any>('get agents')));
    } else {
      return this.http.get(endpoint + '/agents/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
        map(this.extractData), catchError(this.handleError<any>('get agents')));
    }

  }
  getStudents(page): Observable<any> {
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + '/centers/' + localStorage.getItem('center') + '/students/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
        catchError(this.handleError<any>('get students')));
    } else {
      return this.http.get(endpoint + '/students/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
        catchError(this.handleError<any>('get students')));
    }
  }
  getProfessors(page): Observable<any> {
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + '/centers/' + localStorage.getItem("center") + '/teachers/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: 'response' }).pipe(
        catchError(this.handleError<any>('get teachers')));
    } else {
      return this.http.get(endpoint + '/teachers/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: 'response' }).pipe(
        catchError(this.handleError<any>('get teachers')));
    }
  }
  getProfessorsBycenter(center, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + center + '/teachers/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get teachers')));
  }
  getProfessorCourses(id, page): Observable<any> {
    return this.http.get(endpoint + '/teachers/' + id + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get professor courses')));

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
  // getCoursesBySession(center, page): Observable<any> {
  //   return this.http.get(endpoint + '/centers/' + center + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
  //     map(this.extractData), catchError(this.handleError<any>('get centres by Id')));

  // }
  getCenterCourses(id, page): Observable<any> {
    return this.http.get(endpoint + '/centers/' + id + '/courses/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centre courses')));

  }
  getCourseStudents(id, page): Observable<any> {
    return this.http.get(endpoint + '/courses/' + id + '/students/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centre courses')));

  }
  getStudentPayment(id, page): Observable<any> {
    return this.http.get(endpoint + '/students/' + id + '/payments/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get student payment')));

  }
  getSessions(page): Observable<any> {
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
    if (localStorage.getItem('center')) {
      return this.http.get(endpoint + '/centers/' + localStorage.getItem('center') + '/sessions/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
        catchError(this.handleError<any>('get centres')));
    }
    else {
      return this.http.get(endpoint + '/sessions/?page=' + page + requestParams, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
        catchError(this.handleError<any>('get centres')));
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
  getStudentMemberShips(id, page): Observable<any> {
    return this.http.get(endpoint + '/students/' + id + "/memberships/?page=" + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get student memberships')));
  }
  getMemberShipPayment(id, page): Observable<any> {
    return this.http.get(endpoint + '/memberships/' + id + '/payments/?page=' + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get student memberships payment')));
  }
  getLogs(user, page, id): Observable<any> {
    return this.http.get(endpoint + user + "/" + id + "/logs/?page=" + page, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get logs')));
  }
  getStudent(id): Observable<any> {
    return this.http.get(endpoint + '/students/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getCurrentUser(): Observable<any> {
    return this.http.get(endpoint + '/users/current/', { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get centres')));

  }
  getCurrentManager(): Observable<any> {
    return this.http.get(endpoint + '/managers/current/', { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get manager')));

  }
  getCurrentAgent(): Observable<any> {
    return this.http.get(endpoint + '/agents/current/', { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('get manager')));

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
    return this.http.delete(endpoint + '/courses/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('delete session')));

  }
  deleteStudent(id): Observable<any> {
    return this.http.delete(endpoint + '/students/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } }).pipe(
      map(this.extractData), catchError(this.handleError<any>('delete student')));

  }
  addStudent(form): Observable<any> {
    return this.http.post(endpoint + '/students/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(catchError(this.handleError<any>('get centres')));

  }
  addTeacher(form): Observable<any> {
    return this.http.post(endpoint + '/teachers/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));

  }
  editStudent(form, id): Observable<any> {
    return this.http.patch(endpoint + '/students/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit student ')));

  }
  editSession(form, id): Observable<any> {
    return this.http.patch(endpoint + '/sessions/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit session ')));

  }
  editTeacher(form, id): Observable<any> {
    return this.http.patch(endpoint + '/teachers/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit student ')));

  }
  editUser(form, id): Observable<any> {
    return this.http.patch(endpoint + '/users/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit student ')));

  }
  addPhotos(form, user_id): Observable<any> {
    return this.http.put(endpoint + '/users/' + user_id + "/picture/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));

  }
  login(form): Observable<any> {
    return this.http.post(endpoint + '/auth/token/basic/', form, { observe: 'response' }).pipe(
      catchError(this.handleError<any>('login')));

  }
  addMemership(form): Observable<any> {
    return this.http.post(endpoint + '/memberships/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('add memberships')));

  }
  deleteMemership(id): Observable<any> {
    return this.http.delete(endpoint + '/memberships/' + id + '/', { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: 'response' }).pipe(
      catchError(this.handleError<any>('delete memberships')));

  }
  addCentres(form): Observable<any> {
    return this.http.post(endpoint + '/centers/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));

  }
  addCourse(form): Observable<any> {
    return this.http.post(endpoint + '/courses/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('posr Course')));

  }
  editCourse(form, id): Observable<any> {
    return this.http.patch(endpoint + '/courses/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('patch Course')));

  }
  addPayment(form): Observable<any> {
    return this.http.post(endpoint + '/payments/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('add paiment')));

  }
  addSChedule(form): Observable<any> {
    return this.http.post(endpoint + '/courses/schedules/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: 'response' }).pipe(
      catchError(this.handleError<any>('add scedules')));

  }
  addManager(form): Observable<any> {
    return this.http.post(endpoint + '/managers/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('add manager')));

  }
  authBasic(form): Observable<any> {
    return this.http.post(endpoint + '/auth/token/basic/', form, { observe: "response" }).pipe(
      catchError(this.handleError<any>('auth basic ')));

  }
  editManager(form, id): Observable<any> {
    return this.http.patch(endpoint + '/managers/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit manager')));

  }
  editMemeberShip(form, id): Observable<any> {
    return this.http.patch(endpoint + '/memberships/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit memberships')));

  }
  deleteManager(id): Observable<any> {
    return this.http.delete(endpoint + '/managers/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('delete manager')));

  }
  addAgent(form): Observable<any> {
    return this.http.post(endpoint + '/agents/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('add agents')));

  }
  editAgent(form, id): Observable<any> {
    return this.http.patch(endpoint + '/agents/' + id + "/", form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('edit manager')));

  }
  deleteAgent(id): Observable<any> {
    return this.http.delete(endpoint + '/agents/' + id + "/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: 'response' }).pipe(
      catchError(this.handleError<any>('delete agent')));

  }
  editCentres(form, id): Observable<any> {
    return this.http.patch(endpoint + '/centers/' + id + '/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));

  }
  addPicturesCentre(form, id): Observable<any> {
    return this.http.patch(endpoint + '/centers/' + id + '/logo/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('get centres')));

  }
  addSession(form): Observable<any> {
    return this.http.post(endpoint + '/sessions/', form, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') }, observe: "response" }).pipe(
      catchError(this.handleError<any>('add session')));

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
            // this.router.navigate(['404'])

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

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}

