import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../../services/rest.service";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { HomeComponent } from "../../home/home.component";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.component.html',
  styleUrls: ['./student-modal.component.css']
})
export class StudentModalComponent implements OnInit {
  @ViewChild('studentModal', { static: false }) studentModal: ModalDirective;
  userForm: FormGroup;
  studentForm: FormGroup;
  centerForm: FormGroup;
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string = "File name"
  @Input() student: any
  submit: boolean = false
  center: any
  centers: any = []
  sessions: any = []
  courses: any = []
  sellectedSessions: any = [];
  sellectedCourses: any = [];
  constructor(private translateService:TranslateService,private toastr: ToastrService, public home: HomeComponent, private router: Router, private datePipe: DatePipe, private fb: FormBuilder, private rest: RestService, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }

  async ngOnInit() {
    console.log(this.student);
    
    this.userForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      password: new FormControl("0000"),
      birthday: new FormControl(new Date(), Validators.required),
    });
    this.studentForm = this.fb.group({
      notes: new FormControl(""),
      next_contact_name: new FormControl(""),
      next_contact_phone: new FormControl("",Validators.pattern("^(0|00213|[+]213)(5|6|7)(4|5|6|7|8|9)[0-9]{7}$")),
      level: new FormControl(""),
      medical_condition: new FormControl(),
      status: new FormControl("", Validators.required),
    });
    if (localStorage.getItem('center')) {
      this.center = localStorage.getItem('center')
    } else {
      this.centerForm = this.fb.group({
        center: new FormControl(null, Validators.required),
      });
      this.getCenters()
    }
    if (this.student) {
      const date = this.datePipe.transform(new Date(this.student.user.birthday), 'dd-MM-yyyy')
      this.userForm.patchValue({
        name: this.student.user.name,
        family_name: this.student.user.family_name,
        email: this.student.user.email,
        gender: this.student.user.gender,
        birthday: date
      })
      this.studentForm.patchValue({
        notes: this.student.notes,
        next_contact_name: this.student.next_contact_name,
        next_contact_phone: this.student.next_contact_phone,
        level: this.student.level,
        status: this.student.status,
        medical_condition: this.student.medical_condition,
      })
      this.centerForm?.removeControl('center')
      this.imgUrl = this.student.user.picture
      console.log(this.studentForm.value);
      
    }
  }
  get f() { return this.userForm.controls; }
  get s() { return this.studentForm.controls; }
  get c() { return this.centerForm.controls; }
  showPreviewImage(event: any,) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.selectedFile = <File>event.target.files[0];
      this.fileName = this.selectedFile.name.substring(0, 10)
    }
  }
  show() {
    this.studentModal.show();
  }
  manageImg(user) {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('picture', this.selectedFile);      
      this.rest.put('/users/' + user.user.id + "/picture/",fd).subscribe(res => {
        if (res.status === 200) {
          this.router.navigate(['students/detail/' + user.id])
          if (this.student) {
            this.student.user.picture = res.body.picture
          }
        }
        this.router.navigate(['students/detail/' + user.id])
      })
    }
    else{
      this.router.navigate(['students/detail/' + user.id])
    }
  }
  async getSessionsByCenter(center, page) {
    await this.rest.get('/centers/' + center + '/sessions/?page=' + page).toPromise().then(res => {
      let selectedSession: any = []
      res.results.forEach(element => {
        this.student?.memberships_verbose.forEach(mv => {
          if (mv.session === element.id) {
            selectedSession.push(element.id)
          }
        });
        this.sessions.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getSessionsByCenter(center, page)
      }
      this.sellectedSessions = selectedSession
    })
  }
  async getCoursesByCenter(center, page) {
    await this.rest.get('/centers/' + center + "/courses/?page=" + page).toPromise().then(res => {
     if (res?.status===200) {
      let selectedCourse: any = []
      res.body.results.forEach(element => {
        this.student?.memberships_verbose.forEach(mv => {
          if (mv.course === element.id) {
            selectedCourse.push(element.id)
          }
        });
        this.courses.push(element)
      });
      if (res.body.total_pages > page) {
        page++
        this.getCoursesByCenter(center, page)
      }
      this.sellectedCourses = selectedCourse
     }

    })
  }
  getCenters() {
    this.centers = this.home.centres
  }
  manageStudent(form) {
    this.submit = true
    if (this.userForm.invalid || this.studentForm.invalid || this.centerForm?.invalid) {     
      return
    }
    let date = new Date(form.birthday);
    let adduserForm: any
    let Studentform: any
    this.userForm.patchValue({
      birthday: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    })
    if (this.student) {
      Studentform = this.rest.getDirtyValues(this.studentForm)
      Studentform.user = this.rest.getDirtyValues(this.userForm)
      Studentform.center = this.student.center
      this.rest.patch( '/students/' + this.student.id + "/",Studentform ).subscribe(res => {
        if (res?.status === 200) {
          this.manageImg(res.body)
          this.translateService.get('a été modifié avec success').subscribe(result => {
            this.translateService.get('Opération terminée').subscribe(res => {
              this.toastr.success(res.body.user.full_name +result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
            })
          })
          Object.assign(this.student, res.body)
          console.log(res.body);
          this.studentModal.hide()
        }
      })
    } else {
      adduserForm = this.rest.getDirtyValues(this.studentForm)
      adduserForm.user = this.userForm.value
      if (this.center) {
        adduserForm.center = this.center
      } else {
        adduserForm.center = this.centerForm.value.center
      }
      adduserForm.user.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
      this.rest.post('/students/',adduserForm).subscribe(res => {
        if (res?.status === 201) {
          this.translateService.get('étudiant a été crée avec success').subscribe(result => {
            this.translateService.get('Opération terminée').subscribe(res => {
              this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
            })
          })
          this.manageImg(res.body)
          this.studentModal.hide()
        }
      })
    }
  }

  display() {
    console.log(this.sellectedSessions);

  }

}
