import { Component, OnInit } from '@angular/core';
import { RestService } from "../../services/rest.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-professors-details',
  templateUrl: './professors-details.component.html',
  styleUrls: ['./professors-details.component.css']
})
export class ProfessorsDetailsComponent implements OnInit {
  professor: any
  activateRoute: string
  professorCourses: any = []
  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.hash.substring(23 + idLength)
    this.rest.get('/teachers/' + this.route.snapshot.params['id'] + "/" ).subscribe(res => {
     if (res?.status===200) {
      this.professor = res.body
      this.getProfessorCourses(res?.body.id, 1)
      if (!this.professor.status) {
        this.professor.status="notActive"
      }
     }
    })
  }
  changeRoute(route) {
    this.activateRoute = route
  }
  getProfessorCourses(id, page) {
    this.rest.get('/teachers/' + id + '/courses/?page=' + page).subscribe(res => {
     if (res.status===200) {
      res.body.results.forEach(element => {
        this.professorCourses.push(element)
      });
      if (res.body.total_pages > page) {
        page++
        this.getProfessorCourses(id, page)
      }
     }
    })
  }
  onChange(event) {
    console.log(event);
    this.rest.patch('/teachers/' + this.route.snapshot.params['id'] + "/",{ status: event }).subscribe(res => {
      console.log(res);

    })
  }

}
