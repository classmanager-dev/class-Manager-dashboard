import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { RestService } from "../../../services/rest.service";
import { StudentdetailsComponent } from "./studentdetails/studentdetails.component";
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component"
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

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
  students: any[] = []
  student: any
  activateRoute: string
  selectedStudents: any[] = []
  status = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'No active' },
  ];
  @ViewChild('addStudent', { static: false }) addStudent: ModalDirective;
  @ViewChild('StudentdetailsComponent') StudentdetailsComponent: StudentdetailsComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  constructor(private translateService: TranslateService, private toastr: ToastrService, public route: ActivatedRoute, private rest: RestService) { }
  ngOnInit(): void {
    this.param = this.route.snapshot.params['id']
    let idLength = this.route.snapshot.params['id'].length
    let courseIdLength = this.route.snapshot.params['courseId'].length
    this.activateRoute = window.location.hash.substring(35 + idLength + courseIdLength)
    this.getCourse(this.route.snapshot.params['courseId'])
    this.getSEssion(this.param)
  }
  getSEssion(id) {
    this.rest.get('/sessions/' + id).subscribe(res => {
      if (res?.status === 200) {
        this.session = res.body
      }
    })
  }
  getCourse(id) {
    this.rest.get('/courses/' + id).subscribe(res => {
      if (res?.status === 200) {
        this.course = res.body
      }
    })
  }
  changeRoute(route) {
    this.activateRoute = route
  }
  onConfirm(event) {
    this.StudentdetailsComponent.checkedStudents.forEach(element => {
      console.log(this.course.id);
      element.memberships_verbose.forEach(ms => {
        if (ms.course === this.course.id) {
          this.rest.delete('/memberships/' + ms.id + '/').subscribe(res => {
            if (res.status === 204) {
              this.translateService.get('ne plus suit  ce cours').subscribe(result => {
                this.translateService.get('Opération terminée').subscribe(res => {
                  this.toastr.success(element.user.name + " " + element.user.family_name + result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                })
              })
              this.StudentdetailsComponent.students.splice(this.StudentdetailsComponent.students.indexOf(element), 1)
              this.deleteModal.deleteModal.hide()
            }
          })
        }
      });
    });
  }
  openStudentModal() {
  if (this.StudentdetailsComponent?.isLoaded) {
    this.addStudent.show()
    this.selectedStudents = this.StudentdetailsComponent?.students
  }
  }
  onSearch($event) {
    console.log($event);
    this.student = $event.term
    this.getStudents(1)

  }
  getStudents(page) {
    if (this.student) {
      this.rest.get("/centers/" + this.session.center + "/students/?search=" + this.student + "&page=" + page).subscribe(res => {
        this.students = res.body.results
        if (res.body.total_pages > page) {
          page++
          this.getStudents(page)
        }
      })
    }
  }
  addMemeberShip() {
    this.selectedStudents.forEach(element => {
      const index = element.memberships_verbose.findIndex(object => object.course === this.course.id);
      if (index === -1) {
        let date = new Date();
        let form = { student: element.id, course: this.course.id, session: this.course.session, registeration_date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() }
        this.rest.post('/memberships/', form).subscribe(res => {
          if (res.status === 201) {
            this.addStudent.hide()
            this.toastr.success('l\'étudiant avec l\'id ' + res.body.student + " est attachée a la formation " + res.body.course_verbose.name + " avec success", 'Opération terminée')
            this.StudentdetailsComponent.students.push(element)
            element.memberships_verbose.push(res.body)
            console.log(element);
            element.already_exist = true
          }
        })
      } else {
        this.addStudent.hide()
      }
    });

  }
  onChange(event) {
    console.log(event);
    this.rest.patch("/courses/" + this.course.id + "/", { is_active: event }).subscribe(res => {
      console.log(res);

    })

  }
}


