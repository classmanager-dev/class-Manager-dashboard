import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../../services/rest.service";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.component.html',
  styleUrls: ['./student-modal.component.css']
})
export class StudentModalComponent implements OnInit {
  @ViewChild('studentModal', { static: false }) studentModal: ModalDirective;
  studentForm: FormGroup;
  locales = listLocales();
  bsConfig: Partial<BsDatepickerConfig>;
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string = "File name"
  @Input() student: any
  constructor(private datePipe: DatePipe, private fb: FormBuilder, private rest: RestService, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      birthday: new FormControl(new Date(), Validators.required),
      phone: new FormControl("", Validators.required),
    });
    console.log(this.student);
    if (this.student) {
      const date = this.datePipe.transform(new Date(this.student.user.birthday), 'dd-MM-yyyy')
      this.studentForm.patchValue({
        name: this.student.user.name,
        family_name: this.student.user.family_name,
        email: this.student.user.email,
        phone: this.student.user.phone,
        gender: this.student.user.gender,
        birthday: date
      })
      this.imgUrl = this.student.user.picture
    }
  }
  get f() { return this.studentForm.controls; }
  showPreviewImage(event: any, ) {
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
  manageStudent(form) {
    let date = new Date(form.birthday);
    this.studentForm.patchValue({
      birthday: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    })
    if (this.student) {
      this.rest.editStudent({ "user": this.rest.getDirtyValues(this.studentForm), "center": this.student.center }, this.student.id).subscribe(res => {
        this.manageImg(res.user.id)
        Object.assign(this.student, res)
        this.studentModal.hide()
      })
    } else {
      let addStudentForm:any={}
      addStudentForm=this.rest.getDirtyValues(this.studentForm)
     addStudentForm.username=(form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
     console.log(addStudentForm);
      this.rest.addStudent({ "user":  addStudentForm, "center": 1 }).subscribe(res => {
        this.manageImg(res.user.id)
        this.studentModal.hide()
      })
    }
  }

}
