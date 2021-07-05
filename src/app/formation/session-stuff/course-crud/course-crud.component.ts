import { Component, OnInit,ViewChild ,Input} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../../../services/rest.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-course-crud',
  templateUrl: './course-crud.component.html',
  styleUrls: ['./course-crud.component.css']
})
export class CourseCRUDComponent implements OnInit {
  courseForm: FormGroup;
  submit: boolean = false
  professors: any[] = []
  @ViewChild('addFormationModal', { static: false }) addFormationModal: ModalDirective;
  @Input() courses: any
  @Input() session:any
  @Input() course:any

  constructor(private fb: FormBuilder,private rest:RestService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      fee: new FormControl("", Validators.required),
      center: new FormControl(null, Validators.required),
      session: new FormControl(null, Validators.required),
      teacher: new FormControl("", Validators.required),

    });
    this.getProfessors(1)
    if (this.course) {
      this.courseForm.patchValue({
      name: this.course.name,
      description: this.course.description,
      fee: this.course.fee,
      teacher: this.course.teacher,
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
    this.setfixedValues()
    console.log(this.courseForm.value);
    if (this.courseForm.invalid) {
      return
    }
    if (this.course) {
      this.rest.editCourse(this.courseForm.value,this.course.id).subscribe(res=>{
        Object.assign(this.course,res)
      })
      
    } else {
      this.rest.addCourse(this.courseForm.value).subscribe(res => {
        this.courses.unshift(res)
        this.submit=false
        this.courseForm.reset()
        this.setfixedValues()
  
      })
    }
  }
}
