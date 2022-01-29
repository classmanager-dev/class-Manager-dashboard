import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Location } from "@angular/common";
import { CourseCRUDComponent } from "../session-stuff/course-crud/course-crud.component";
import { RestService } from "../../services/rest.service";
import { ConfirmationModalComponent } from "../../confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-session-stuff',
  templateUrl: './session-stuff.component.html',
  styleUrls: ['./session-stuff.component.css']
})
export class SessionStuffComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @ViewChild('addFormationModal') addFormationModal: CourseCRUDComponent;

  bsConfig: Partial<BsDatepickerConfig>;

  courses: any[] = []
  session: any
  activateRoute: string
  constructor(private route: ActivatedRoute, private rest: RestService, private location: Location, private localeService: BsLocaleService,) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }

  ngOnInit(): void {
    this.getCourses(this.route.snapshot.params['id'], 1)
    this.getSession(this.route.snapshot.params['id'])
  }

  getCourses(sessionId, page) {
    this.rest.get('/sessions/' + sessionId + "/courses/?page=" + page ).subscribe(res => {
      if (res?.status===200) {
        res.body.results.forEach(element => {
          this.courses.push(element)
          element.schedules_verbose.forEach(sv => {
            var start_at = sv.start_at.split(':');
            var finish_at = sv.finish_at.split(':');
            start_at.pop();
            finish_at.pop();
            sv.startAt=start_at.join(':');
            sv.finishAt=finish_at.join(':');
          });       
        });
        if (res.body.total_pages > page) {
          page++
          this.getCourses(sessionId, page)
        }
      }
    })
  }


  getSession(id) {
    this.rest.get('/sessions/' + id).subscribe(res => {
      if (res?.status===200) {
        this.session = res.body
      }
    })
  }
  showModal() {
    if (this.addFormationModal) {
      this.addFormationModal.addFormationModal.show()
    }
  }
  onConfirm(event) {
    this.rest.patch('/sessions/' + this.route.snapshot.params['id'] + "/",{ is_active: false }).subscribe(res => {
      if (res?.status === 200) {
        this.location.back()
      }
    })

  }

}
