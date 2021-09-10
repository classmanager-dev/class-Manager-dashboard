import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentModalComponent } from "../student-modal/student-modal.component";
import { RestService } from "../../services/rest.service";
import { StudentCoursesComponent } from "./student-courses/student-courses.component";
import { MemebershipModalComponent } from '../memebership-modal/memebership-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

import { ConfirmationModalComponent } from 'src/app/confirmation-modal/confirmation-modal.component';
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
  constructor(private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private rest: RestService,private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.hash.substring(19 + idLength)

    this.rest.getStudent(this.route.snapshot.params['id']).subscribe(res => {
      this.student = res
    })

  }
  onChange(event) {
    console.log(event);
    this.rest.editStudent({ status: event }, this.route.snapshot.params['id']).subscribe(res => {

    })

  }
  changeRoute(route) {
    this.activateRoute = route
  }
  onConfirm(event) {
    let form:any={unregisteration_date:this.datePipe.transform(new Date(), 'yyyy-MM-dd'),is_active:false}
    for (let index = 0; index < this.student.memberships_verbose.length; index++) {
      if (this.student.memberships_verbose[index].checked) {
       
        this.rest.editMemeberShip(form,this.student.memberships_verbose[index].id).subscribe(res => {
          if (res.status === 200) {
            this.toastr.success('l\'étudiant  ' + this.student.user.family_name +" "+ this.student.user.name + " ne suit plus la formation " + this.student.memberships_verbose[index].course_verbose.name, 'Opération terminée')
            // this.student.memberships_verbose.splice(index, 1)
            this.deleteModal.deleteModal.hide()
          }

        })
      }

    }
  }
}
