import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { RestService } from "../../services/rest.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
@Component({
  selector: 'app-manage-professors',
  templateUrl: './manage-professors.component.html',
  styleUrls: ['./manage-professors.component.css']
})
export class ManageProfessorsComponent implements OnInit {
  @ViewChild('professorModal', { static: false }) professorModal: ModalDirective;

  professorForm: FormGroup;
  courseForm: FormGroup;
  imgUrl: any[];
  courses: any[] = [];
  centers: any[] = [];
  towns: any[] = [];
  selectedFile: File = null;
  fileName: string = "File name"
  bsConfig: Partial<BsDatepickerConfig>;
  locales = listLocales();
  submit: boolean = false
  center=localStorage.getItem('center')
  @Input() professor
  constructor(private router:Router,private toastr:ToastrService,private datePipe: DatePipe, private fb: FormBuilder, private localeService: BsLocaleService, private rest: RestService) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");

  }

  ngOnInit(): void {
    this.professorForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl("", Validators.required),
      birthday: new FormControl(new Date(), Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      town: new FormControl(null, Validators.required),
      password: new FormControl("0000"),
      center: new FormControl(null, Validators.required),
    });
    this.courseForm = this.fb.group({
      course: new FormControl(null, Validators.required),
    })
    if (this.professor) {
      const date = this.datePipe.transform(new Date(this.professor.user.birthday), 'dd-MM-yyyy')
      this.professorForm.patchValue({
        name: this.professor.user.name,
        family_name: this.professor.user.family_name,
        gender: this.professor.user.gender,
        email: this.professor.user.email,
        phone: this.professor.user.phone,
        birthday: date,
        address: this.professor.user.address,
        center: this.professor.center,
        town: this.professor.user.town,
      })
      console.log(this.professorForm.value);

      this.selectCenter = this.professor.center
      this.getCourses(this.professor.center, 1)
    }
    if (this.center) {
      this.professorForm.patchValue({
        center:this.center
      })
      this.getCourses(this.center,1)
    }else{
      this.getCenters(1)
    }
    this.getTowns(1)
  }
  get f() { return this.professorForm.controls; }
  get g() { return this.courseForm.controls; }
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
  manageImg(id) {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('picture', this.selectedFile);
      this.rest.addPhotos(fd, id).subscribe(res => {
        // this.professor.user.picture = res.picture

      })
    }
  }
  getCourses(id, page) {
    this.rest.getCenterCourses(id, page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
        if (element.teacher === this.professor?.id) {
          this.courseForm.patchValue({
            course: element.id
          })
        }
      });
      if (res.total_pages > page) {
        page++
        this.getCourses(id, page)
      }
    })
    console.log(this.courses);

  }
  getCenters(page) {
    this.rest.getCentres(page).subscribe(res => {
      res.results.forEach(element => {
        this.centers.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCenters(page)
      }
    })

  }
  getTowns(page) {
    this.rest.getTowns(page).subscribe(res => {
      res.results.forEach(element => {
        this.towns.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getTowns(page)
      }
    })

  }
  selectCenter() {
    this.courses = []
    this.getCourses(this.professorForm.value.center, 1)

  }
  manageProfessor(form) {
    this.submit = true
    if (this.professor) {
      this.professorForm.removeControl('password')
    }
    if (this.professorForm.invalid || this.courseForm.invalid) {
      console.log(this.g);

      return
    }
    let date = new Date(form.birthday)
    this.professorForm.patchValue({ birthday: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() })
    if (this.professor) {
      this.rest.editTeacher({ "user": this.rest.getDirtyValues(this.professorForm), "center": this.professor.center }, this.professor.id).subscribe(res => {
        this.manageImg(res.user.id)
        Object.assign(this.professor, res)
        console.log(this.professor);
        this.professor.user.birthday = this.datePipe.transform(new Date(this.professor.user.birthday), 'dd-MM-yyyy')
        console.log(this.professor.user.birthday);
        this.professorModal.hide()

      })
    } else {
      let addProfForm: any = {}      
      addProfForm = this.professorForm.value
      addProfForm.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
      console.log({ "user": addProfForm, "center": addProfForm.center });
      this.rest.addTeacher({ "user": addProfForm, "center": addProfForm.center }).subscribe(res => {
       if (res.status===201) {
        this.rest.editCourse({ teacher: res.body.id }, this.courseForm.value.course).subscribe(result => {
          console.log(result);

        })
        this.toastr.success( 'Le professeur  a été crée avec success','Opération terminée');
        this.manageImg(res.body.user.id)
        this.router.navigate(['professeurs/details/'+res.body.id])

        this.professorModal.hide()
       }
      })
    }

  }
}
