import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { RestService } from "../../services/rest.service";
@Component({
  selector: 'app-manage-professors',
  templateUrl: './manage-professors.component.html',
  styleUrls: ['./manage-professors.component.css']
})
export class ManageProfessorsComponent implements OnInit {
  @ViewChild('professorModal', { static: false }) professorModal: ModalDirective;

  professorForm: FormGroup;
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string = "File name"
  bsConfig: Partial<BsDatepickerConfig>;
  locales = listLocales();
  @Input() professor
  constructor(private datePipe: DatePipe,private fb: FormBuilder, private localeService: BsLocaleService,private rest:RestService) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");

  }

  ngOnInit(): void {
    this.professorForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      birthday: new FormControl(new Date(), Validators.required),
    });
    if (this.professor) {
      const date = this.datePipe.transform(new Date(this.professor.user.birthday), 'dd-MM-yyyy')
      this.professorForm.patchValue({
        name: this.professor.user.name,
        family_name: this.professor.user.family_name,
        gender: this.professor.user.gender,
        email: this.professor.user.email,
        // password: this.professor.user.password,
        birthday: date,
      })
    }
    console.log(this.professor);

  }
  get f() { return this.professorForm.controls; }
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
  manageImg(id) {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('picture', this.selectedFile);
      this.rest.addPhotos(fd, id).subscribe(res => {
        this.professor.user.picture = res.picture

      })
    }
  }
  manageProfessor(form) {
   if (this.professor) {
    this.rest.editStudent({ "user": this.rest.getDirtyValues(this.professorForm), "center": 1 }, this.professor.id).subscribe(res => {
      this.manageImg(res.user.id)
      Object.assign(this.professor, res)
    })
   }else{
     console.log(form);
     
   }

  }
}
