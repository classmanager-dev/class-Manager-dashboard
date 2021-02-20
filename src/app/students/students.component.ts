import { Component, OnInit, ViewChild, } from '@angular/core';
import { StudentModalComponent } from "./student-modal/student-modal.component";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { Router } from "@angular/router";
import { RestService } from "../services/rest.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService,BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
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
  membershipForm: FormGroup;
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(public router: Router, private rest: RestService, private fb: FormBuilder,private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }

  ngOnInit() {
    console.log(this.rest.getData());
    
    this.getStudents(1)
    this.getCourses(1)
    this.getSessions(1)
    this.membershipForm = this.fb.group({
      course: new FormControl(null, Validators.required),
      registeration_date: new FormControl( new Date(), Validators.required),
      student: new FormControl(""),
    });
  }
  get f() { return this.membershipForm.controls; }

  gotoDetails(id) {
    this.router.navigate(['students/detail/'+id])
  }
  getStudents(page) {
    this.rest.getStudents(page).subscribe(res => {
      this.students = res
      res.results.forEach(element => {
        element.checked = false
      });
    })
  }
  addMembership(form) {
    form.student=this.student.id
    this.submit = true
    
    if (this.membershipForm.invalid) {
      return
    }
    this.rest.addMemership(form).subscribe(res => {

    })
  }
  onConfirm(event){
    console.log(event);
    
    console.log(this.student);
    
  }
  showHiddenButtons(event, student) {
    this.showButtons = event
  this.students.results.forEach(element => {
      element.checked=false
    });
    student.checked=true
    this.student = student
   
  }
  getCourses(page) {
    this.rest.getCourses(page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCourses(page)
      }
     
    })
  }
  getSessions(page) {
    this.rest.getSessions(page).subscribe(res => {
      res.results.forEach(element => {
        this.sessions.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getSessions(page)
      }

    })
  }
}
