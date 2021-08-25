import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { RestService } from "../../services/rest.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
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
  selectedCourses:any=[]
  @Input() professor
  constructor(private router:Router,private toastr:ToastrService,private datePipe: DatePipe, private fb: FormBuilder, private localeService: BsLocaleService, private rest: RestService) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");

  }

  async ngOnInit() {
    this.professorForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl("", [Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      birthday: new FormControl(new Date(), Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      town: new FormControl(null, Validators.required),
      password: new FormControl("0000"), 
      status: new FormControl("inActive"),
      center: new FormControl(null, Validators.required),
    });
    this.courseForm = this.fb.group({
      course: new FormControl(null),
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
      this.imgUrl = this.professor.user.picture
    }
    if (this.center) {
      this.professorForm.patchValue({
        center:this.center
      })
     await  this.getCourses(this.center,1)
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
  manageImg(id) : Observable<any>{
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('picture', this.selectedFile);
      this.rest.addPhotos(fd, id).subscribe(res => {
       if (res.status===200) {
        if (this.professor) {
          this.professor.user.picture = res.boy.picture
        }
       }

      })
      return
    }
     
  }
  async getCourses(id, page) {
 await    this.rest.getCenterCourses(id, page).toPromise().then(res => {
   let selectedCoursees:any=[]
      res.results.forEach(element => {
        this.courses.push(element)
        if (element.teacher === this.professor?.id) {
          selectedCoursees.push(element.id)
        }
      });
      if (res.total_pages > page) {
        page++
        this.getCourses(id, page)
      }
      this.selectedCourses=selectedCoursees
    })
  
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
      console.log(this.professorForm);
      console.log(this.courseForm);
      
      return
    }
    let date = new Date(form.birthday)
    this.professorForm.patchValue({ birthday: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() })
    if (this.professor) {
      this.rest.editTeacher({ "user": this.rest.getDirtyValues(this.professorForm), "center": this.professor.center }, this.professor.id).subscribe(res => {
        if (res.status === 200) {
          this.manageImg(res.body.user.id)
          Object.assign(this.professor, res.body)
          this.professorForm.patchValue({
            birthday: this.datePipe.transform(new Date(res.body.user.birthday), 'dd-MM-yyyy')
          })
          this.professorModal.hide()
        }

      })
    } else {
      let addProfForm: any = {}
      addProfForm = this.professorForm.value
      addProfForm.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
      this.rest.addTeacher({ "user": addProfForm, "center": addProfForm.center }).subscribe(res => {
        if (res.status === 201) {
          this.rest.editCourse({ teacher: res.body.id }, this.courseForm.value.course).subscribe(result => {
            console.log(result);

          })
          this.toastr.success('Le professeur  a été crée avec success', 'Opération terminée');
          this.manageImg(res.body.user.id)
          this.router.navigate(['professeurs/details/' + res.body.id])

          this.professorModal.hide()
        }
      })
    }

  }
}
