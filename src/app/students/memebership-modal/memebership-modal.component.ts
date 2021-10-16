import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from 'src/app/services/rest.service';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-memebership-modal',
  templateUrl: './memebership-modal.component.html',
  styleUrls: ['./memebership-modal.component.css']
})
export class MemebershipModalComponent implements OnInit {
  @ViewChild('membership', { static: false }) membership: ModalDirective;
  @Input() student: any
  membershipForm: FormGroup;
  courses: any[] = []
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;
  submit: boolean = false
  sessions: any[] = []
  alreadyExist: boolean = false
  constructor(private toastr: ToastrService, private fb: FormBuilder, private rest: RestService, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }
  get f() { return this.membershipForm.controls; }

  ngOnInit(): void {
    this.membershipForm = this.fb.group({
      course: new FormControl(null, Validators.required),
      session: new FormControl(null, Validators.required),
      registeration_date: new FormControl(new Date(), Validators.required),
      student: new FormControl(""),
    });
    this.sessions.length = 0
    this.getSessionsByCenter(1)
  }
  getCoursesBySession(page) {
    this.courses.length = 0
    this.membershipForm.controls['course'].setValue(null)
    this.membershipForm.patchValue({
      course: null
    })
    this.rest.getCoursesBySession(this.membershipForm.controls['session'].value, page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCoursesBySession(page)
      }

    })
  }
  addMembership(form) {
    this.alreadyExist=false
    let date = new Date(form.registeration_date);
    form.registeration_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    form.student = this.student.id
    this.submit = true
    if (this.membershipForm.invalid) {
      return
    }
    const found = this.student.memberships_verbose.some(el => el.course === form.course);
    if (found) {
     this.alreadyExist=true

    } else {
      this.rest.addMemership(form).subscribe(res => {
        if (res.status === 201) {
          this.student.memberships_verbose.unshift(res.body)
          this.membership.hide()
          this.toastr.success('l\'étudiant avec l\'id ' + res.body.student + " est attachée a la formation " + res.body.course_verbose.name + " avec success", 'Opération terminée')

        }
      })
    }

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
