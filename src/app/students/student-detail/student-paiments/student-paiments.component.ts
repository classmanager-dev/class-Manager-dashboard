import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentDetailComponent } from "../student-detail.component";
import { RestService } from "../../../services/rest.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-paiments',
  templateUrl: './student-paiments.component.html',
  styleUrls: ['./student-paiments.component.css']
})
export class StudentPaimentsComponent implements OnInit {
  @Input() showDiv: any;
  courses: any = []
  paiment: FormGroup;
  @ViewChild('paimentModal', { static: false }) paimentModal: ModalDirective;
  constructor(private datePipe: DatePipe,public studentDetail: StudentDetailComponent, private rest: RestService, private fb: FormBuilder) { }
  collapse: boolean = false
  isCollapsed = true;
  student: any
  submit :boolean=false
  ngOnInit(): void {
    this.student = this.studentDetail.student
    
    this.paiment = this.fb.group({
      course: new FormControl(null, Validators.required),
      amount: new FormControl("", Validators.required),
      student: this.student.id,
      center: this.student.center,
      date:this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      note:"string",
      reference:"string"

    });
   if (this.student) {
    this.getStudentCourses(1)
   }
  }
  get f(){return this.paiment.controls}
  addPaiment() {
    this.paimentModal.show()
  }
  getStudentCourses(page) {
    this.rest.getStudentCourses(this.student.id, page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
      });
      console.log(this.courses);
      
      // if (res.total_pages > page) {
      //   page++
      //   console.log(page);
      //   this.getStudentCourses(page)
      // }
    })
   
    
  }
  addPayment(form){
    this.submit=true 
   if (this.paiment.invalid) {
     return 
   }
    this.rest.addPayment(form).subscribe(res=>{
      console.log(res);
      
    })
  }
}
