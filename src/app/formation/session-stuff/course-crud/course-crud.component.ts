import { Component, OnInit,ViewChild ,Input} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../../../services/rest.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from "@angular/router";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { listLocales } from 'ngx-bootstrap/chronos';

import { DatePipe } from '@angular/common';
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-course-crud',
  templateUrl: './course-crud.component.html',
  styleUrls: ['./course-crud.component.css']
})
export class CourseCRUDComponent implements OnInit {
  courseForm: FormGroup;
  submit: boolean = false
  professors: any[] = []
  myConfig  = {
    option: {
      minute:false,
      hour:false,
      year:false,
    },
    multiple:true
  }
  @ViewChild('addFormationModal', { static: false }) addFormationModal: ModalDirective;
  @Input() courses: any
  @Input() session:any
  @Input() course:any
  bsConfig: Partial<BsDatepickerConfig>;
  minDate:Date;
  saveAction:boolean=false
  constructor(private toast:ToastrService,private fb: FormBuilder,private rest:RestService,private route: ActivatedRoute, private localeService: BsLocaleService,private router:Router) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
   }

  ngOnInit(): void {  
    this.courseForm = this.fb.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      fee: new FormControl("", Validators.required),
      center: new FormControl(null, Validators.required),
      session: new FormControl(null, Validators.required),
      teacher: new FormControl(null, Validators.required),
      capacity: new FormControl("", Validators.required),
      starting_date: new FormControl(new Date(), Validators.required),
      finishing_date: new FormControl(new Date(), Validators.required),
      start_at: new FormControl(new Date(), Validators.required),
      finish_at: new FormControl(new Date(), Validators.required),
      repeat:new FormControl('',Validators.required)
    });
    this.getProfessors(1)
    if (this.course) {     
      this.courseForm.patchValue({
      name: this.course.name,
      description: this.course.description,
      fee: this.course.fee,
      teacher: this.course.teacher,
      capacity: this.course.capacity,
      starting_date: new Date(this.course.starting_date|| new Date()),
      finishing_date: new Date(this.course.finishing_date || new Date()),
      start_at: this.course.start_at||new Date(),
      finish_at:this.course.finish_at ||new Date(),
      repeat: this.course.repeat,
      })
    }
  }
  get f() { return this.courseForm.controls }
  setfixedValues(){
  if (this.course) {
    this.courseForm.controls['center'].setValue(this.course.center)

  } else {
    this.courseForm.controls['center'].setValue(this.session.center)
  }
  this.courseForm.controls['session'].setValue(this.route.snapshot.params['id'])

  }
  getProfessors(page) {
    this.rest.getProfessors(page).subscribe(res => {
      res.results.forEach(element => {
        this.professors.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getProfessors(page)
      }
    })
  }
  crudCourse() {
    this.submit = true
    let start_at = new Date(this.courseForm.value.start_at)
    let finish_at = new Date(this.courseForm.value.finish_at)
    this.courseForm.patchValue({ start_at: start_at.getHours() + ':' + start_at.getMinutes(),finish_at: finish_at.getHours() + ':' + finish_at.getMinutes()})  
    // this.courseForm.patchValue({ finish_at: finish_at.getHours() + ':' + finish_at.getMinutes()})  
    this.setfixedValues()
    if (this.courseForm.invalid) {
      return
    }
    if (this.course) {
      
      this.rest.editCourse(this.rest.getDirtyValues(this.courseForm),this.course.id).subscribe(res=>{
        console.log(res);
        
       if (res.status===200) {
         this.toast.success( 'Le cours a modifié  avec success','Opération terminée');
        Object.assign(this.course,res.body)
        this.addFormationModal.hide()
       }
      })
      
    } else {
      this.rest.addCourse(this.courseForm.value).subscribe(res => {
        if (res?.status===201) {
         this.toast.success( 'Le cours a été crée avec success','Opération terminée');
          this.courses.unshift(res.body)
        this.submit=false
        this.courseForm.reset()
        this.setfixedValues()
        if (this.saveAction) {
          this.router.navigate(['./course-details/'+res.body.id],{relativeTo: this.route})
          this.addFormationModal.hide()
        }
        }
      })
    }
  }
  setMinDate() {
    this.minDate=new Date()
    this.minDate = this.courseForm.controls['starting_date'].value
    this.minDate.setDate(this.minDate.getDate());
  }
}