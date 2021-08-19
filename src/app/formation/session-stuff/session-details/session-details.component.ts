import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { RestService } from "../../../services/rest.service";
@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  selectedCityName = 'Active';
  param: any
  session: any 
  course: any 
  activateRoute: string
  status = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'No active' },
  ];
  constructor(public route: ActivatedRoute, private rest: RestService) { }

  ngOnInit(): void {
    this.param = this.route.snapshot.params['id']
    let idLength = this.route.snapshot.params['id'].length
    let courseIdLength = this.route.snapshot.params['courseId'].length
    this.activateRoute = window.location.hash.substring(35 + idLength+courseIdLength)
    this.getCourse(this.route.snapshot.params['courseId'])
    this.getSEssion(this.param)

  }
  getSEssion(id) {
    this.rest.getSession(id).subscribe(res => {
      this.session = res
    })
  }
  getCourse(id) {
    this.rest.getCourse(id).subscribe(res => {
      this.course = res
    })
  }
  changeRoute(route) {
    this.activateRoute = route
  }
}


