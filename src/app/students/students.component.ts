import { Component, OnInit, ViewChild, } from '@angular/core';
import { StudentModalComponent } from "./student-modal/student-modal.component";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { Router, ActivatedRoute } from "@angular/router";
import { RestService } from "../services/rest.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  showButtons: boolean = false
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @ViewChild('membership', { static: false }) membership: ModalDirective;
  courses: any[] = []
  sessions: any[] = []
  students: any
  submit: boolean = false
  student: any
  currentPage: any;
  page: number = 1
  membershipForm: FormGroup;
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private route: ActivatedRoute, public router: Router, private rest: RestService, private fb: FormBuilder, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage =1;
      }
      this.getStudents(this.currentPage)
    })

    this.membershipForm = this.fb.group({
      course: new FormControl(null, Validators.required),
      session: new FormControl(null, Validators.required),
      registeration_date: new FormControl(new Date(), Validators.required),
      student: new FormControl(""),
    });
  }
  get f() { return this.membershipForm.controls; }

  gotoDetails(id) {
    this.router.navigate(['students/detail/' + id])
  }
  getStudents(page) {
    
    let center:any
    center=localStorage.getItem('center')
    if (center) {
      this.rest.getStudentsByCenter(center, page).subscribe(res => {
        this.students = res
        res.results.forEach(element => {
          element.checked = false
        });
      })
    } else {
      this.rest.getStudents(page).subscribe(res => {
        this.students = res
        res.results.forEach(element => {
          element.checked = false
        });
      })
    }
  }
  addMembership(form) {
    let date = new Date(form.registeration_date);
    form.registeration_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    form.student = this.student.id
    console.log(form);
    this.submit = true
    if (this.membershipForm.invalid) {
      return
    }
    this.rest.addMemership(form).subscribe(res => {
      this.student.memberships_verbose.push(res)
      this.membership.hide()
    })
  }
  onConfirm(event) {
    console.log(this.student);
    this.rest.deleteStudent(this.student.id).subscribe(res => {
      for (let index = 0; index < this.students.results.length; index++) {
        if (this.students.results[index].id === this.student.id) {
          this.students.results.splice(index, 1)
          this.deleteModal.deleteModal.hide()
        }
      }
    })

  }
  showHiddenButtons(event, student) {
    this.showButtons = event
    this.students.results.forEach(element => {
      element.checked = false
    });
    student.checked = true
    this.student = student

  }
  getCoursesBycenter(page) {
    this.rest.getCoursesBycenter(this.student.center, page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCoursesBycenter(page)
      }

    })
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/students'], { queryParams: { page: this.page }});

  }
  showMemModal() {
    this.membership.show()
    this.getCoursesBycenter(1)
    this.getSessionsByCenter(1)
  }
  getSessionsByCenter(page) {
    this.rest.getSessionsByCenter(this.student.center, page).subscribe(res => {
      res.results.forEach(element => {
        this.sessions.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getSessionsByCenter(page)
      }

    })
  }
}
