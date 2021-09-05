import { Component, OnInit, Input, ViewChild ,Output,EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentDetailComponent } from "../student-detail.component";
import { RestService } from "../../../services/rest.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-student-paiments',
  templateUrl: './student-paiments.component.html',
  styleUrls: ['./student-paiments.component.css']
})
export class StudentPaimentsComponent implements OnInit {
  @Input() showDiv: any;
  isLoaded:boolean=false
  courses: any = []
  paiment: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  @ViewChild('paimentModal', { static: false }) paimentModal: ModalDirective;
  constructor(private toastr: ToastrService, private datePipe: DatePipe, public studentDetail: StudentDetailComponent, private rest: RestService, private fb: FormBuilder, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }
  collapse: boolean = false
  student: any
  submit: boolean = false
  payments: any[] = []
  ngOnInit(): void {
    this.student = this.studentDetail.student

    this.paiment = this.fb.group({
      course: new FormControl(null, Validators.required),
      amount: new FormControl("", Validators.required),
      student: this.student.id,
      center: this.student.center,
      date: new FormControl(new Date(), Validators.required),
      note: new FormControl("", Validators.required),
      reference: "string"

    });
    if (this.student) {
      this.getStudentCourses(1)
      this.getPayment(1)

    }   
  }
  get f() { return this.paiment.controls }
  addPaiment() {
    this.paimentModal.show()
  }
  
  getPayment(page) {
    this.rest.getStudentPayment(this.student.id, page).subscribe(res => {
      
      if (res.status===200) {
        this.isLoaded=true
        res.body.results.forEach(element => {
          element.isCollapsed=true
          // const found = this.payments.some(el => el.course === element.course);
          // if (!found) {
          this.payments.push(element)
            console.log(element);
            
          // }else console.log("the course has been payed before");
          
          // this.rest.getCourse(element.course).subscribe(result => {
          //   element.course_verbose = result
          // })
        });
        if (res.body.total_pages > page) {
          page++
          this.getPayment(page)
        }
      }
    })        
  }
  getStudentCourses(page) {
    this.rest.getStudentCourses(this.student.id, page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getStudentCourses(page)
      }
    })


  }
  addPayment(form) {
    console.log(form);
    let date = new Date(form.date);
    this.submit = true
    if (this.paiment.invalid) {
      return
    }
    form.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    this.student.memberships_verbose.forEach(element => {
      if (element.course===form.course) {
        form.membership=element.id
      }
    });
    this.rest.addPayment(form).subscribe(res => {
      this.payments.unshift({amount: 300,
        date: "2021-09-05",
        id: 59,
        membership: 85,
        note: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque, tenetur.",
        reference: "59-14-8-57"})
        console.log(this.payments);
        
      if (res.status === 201) {       
        this.payments.push(res.body)
        console.log(this.payments);

        this.toastr.success('Paiment a été crée avec success', 'Opération terminée');
        this.paimentModal.hide()

      }

    })
  }
}
