import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from "@angular/router";
import { RestService } from "../../services/rest.service";
@Component({
  selector: 'app-session-stuff',
  templateUrl: './session-stuff.component.html',
  styleUrls: ['./session-stuff.component.css']
})
export class SessionStuffComponent implements OnInit {
  @ViewChild('addFormationModal', { static: false }) addFormationModal: ModalDirective;
  courses: any[] = []
  constructor(private route: ActivatedRoute, private rest: RestService) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.params['id']);
    this.getCourses(this.route.snapshot.params['id'], 1)
  }
  getCourses(sessionId, page) {
    this.rest.getCoursesBySession(sessionId, page).subscribe(res => {
      console.log(res);
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCourses(sessionId, page)
      }
    })
  }
  // showdeleteSessionModal(): void {
  //   this.deleteSessionModal.show();
  // }
}
