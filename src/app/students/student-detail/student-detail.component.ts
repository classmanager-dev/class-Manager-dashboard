import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentModalComponent } from "../student-modal/student-modal.component";
import { RestService } from "../../services/rest.service";
import { StudentCoursesComponent } from "./student-courses/student-courses.component";
import { MemebershipModalComponent } from '../memebership-modal/memebership-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

import { ConfirmationModalComponent } from 'src/app/confirmation-modal/confirmation-modal.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  @ViewChild('studentCourses') studentCourses: StudentCoursesComponent;
  @ViewChild('membershipModal') membershipModal: MemebershipModalComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  student: any
  activateRoute: string
  constructor(private translateService: TranslateService, private toastr: ToastrService, private route: ActivatedRoute, private rest: RestService, private datePipe: DatePipe) {

  }
  ngOnInit(): void {
      switch (this.route.snapshot.firstChild.routeConfig.path) {
        case "courses":
          this.activateRoute = "courses"
          break;
        case "information":
          this.activateRoute = "information"
          break;
        case "paiment":
          this.activateRoute = "paiment"
          break;
        case "modification":
          this.activateRoute = "modification"
          break;
      }
    this.rest.get('/students/' + this.route.snapshot.params['id'] + "/").subscribe(res => {
      if (res?.status === 200) {
        this.student = res.body
        if (!this.student.status) {
          this.student.status = "notActive"
        }
      }
    })
  }
  onChange(event) {
    console.log(event);
    this.rest.patch('/students/' + this.route.snapshot.params['id'] + "/", { status: event }).subscribe(res => {

    })

  }
  changeRoute(route) {
    this.activateRoute = route
  }
  onConfirm(event) {
   
    for (let index = 0; index < this.student.memberships_verbose.length; index++) {
      if (this.student.memberships_verbose[index].checked) {
        this.rest.delete('/memberships/' + this.student.memberships_verbose[index].id + "/").subscribe(res => {
          if (res?.status === 204) {
            this.student.memberships_verbose.splice(index,1)
            this.translateService.get('ne suit plus la formation').subscribe(result => {
              this.translateService.get('Opération terminée').subscribe(res => {
                this.toastr.success(this.student.user.family_name + " " + this.student.user.name + result + this.student.memberships_verbose[index].course_verbose.name, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            this.deleteModal.deleteModal.hide()
          }

        })
      }

    }
  }
}
