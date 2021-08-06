import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../../services/rest.service";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { HomeComponent } from "../../home/home.component";
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
  constructor(public home: HomeComponent, private router: Router, private datePipe: DatePipe, private fb: FormBuilder, private rest: RestService, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("0000"),
      birthday: new FormControl(new Date(), Validators.required),
    });
    this.studentForm = this.fb.group({
      notes: new FormControl(""),
      next_contact_name: new FormControl(""),
      next_contact_phone: new FormControl(""),
      level: new FormControl(null),
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
      })
      this.centerForm?.removeControl('center')

      this.imgUrl = this.student.user.picture
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
      this.fileName = this.selectedFile.name
    }
  }
  show() {
    this.studentModal.show();
  }
  hide() {
    this.studentModal.hide();
  }
  manageImg(id) {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('picture', this.selectedFile);
      this.rest.addPhotos(fd, id).subscribe(res => {
        if (this.student) {
          this.student.user.picture = res.picture
        }

      })
    }
  }
  getCenters() {
    this.centers = this.home.centres
  }
  manageStudent(form) {   
    this.submit = true
    if (this.userForm.invalid || this.studentForm.invalid||this.centerForm?.invalid) {
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
      this.rest.editStudent(Studentform, this.student.id).subscribe(res => {
        this.manageImg(res.user.id)
        Object.assign(this.student, res)
        this.studentModal.hide()
      })
    } else {
      adduserForm = this.rest.getDirtyValues(this.studentForm)
      adduserForm.user = this.userForm.value
      adduserForm.status = "notActive"
      if (this.center) {
        adduserForm.center = this.center
      } else {
        adduserForm.center = this.centerForm.value.center
      }
      adduserForm.user.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
      this.rest.addStudent(adduserForm).subscribe(res => {
        this.manageImg(res.user.id)
        this.studentModal.hide()
        this.router.navigate(['students/detail/' + res.id])
      })
    }
  }

}
