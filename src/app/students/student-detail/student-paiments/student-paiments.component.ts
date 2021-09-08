import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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
  isLoaded: boolean = false
  courses: any = []
  paiment: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  @ViewChild('paimentModal', { static: false }) paimentModal: ModalDirective;
  constructor(private toastr: ToastrService, private datePipe: DatePipe, public studentDetail: StudentDetailComponent, private rest: RestService, private fb: FormBuilder, private localeService: BsLocaleService) {
    this.localeService.use("fr");
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
  }
  public barChartOptions = {
    maintainAspectRatio: false,
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: "#fff",
      titleFontColor: "#08102B",
      titleFontFamily: "latoMeduim",
      bodyFontColor: "#3762F6",
      bodyFontFamily: "latoMeduim",
      xPadding: 20,
      borderWidth: 1,
      borderColor: "#3762F633",
      displayColors: false
    },
  };
  public barChartLabels = ['2006', '2007'];
  public barChartType = 'pie';
  public barChartLegend = false;
  collapse: boolean = false
  student: any
  submit: boolean = false
  payments: any[] = []
  memeberships: any[] = []
  public pieChartColors = [
    {
      backgroundColor: ['#0049C9', '#dee2e6', 'rgba(0,0,255,0.3)'],
    },
  ];
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
    this.memeberships = this.student.memberships_verbose
    this.student.memberships_verbose.forEach(element => {
     this.getMemberShipPayment(element,1)
    });
    this.configureChart()
  }
  configureChart(){
    this.memeberships.forEach(element => {
      let pieChartdata: any[] = []
      let pieChartLabel: any[] = []
      element.isCollapsed = true
      pieChartdata.push(element.paid_fee)
      pieChartdata.push(element.due_fee)
      pieChartLabel = ["frais payés", "frais dus"]
      element.pieChartdata = [{ data: pieChartdata, }]
      element.pieChartLabel = pieChartLabel
    });
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
  getMemberShipPayment(membership,page){
    this.rest.getMemberShipPayment(membership.id,page).subscribe(res=>{
      let array:any[]=[]
      res.results.forEach(element => {
        array.push(element)
      });
      membership.payments=array
      if (res.total_pages>page) {
        page++
        this.getMemberShipPayment(membership,page)
      }     
    })
  }
  addPayment(form) {
    let date = new Date(form.date);
    this.submit = true
    if (this.paiment.invalid) {
      return
    }
    form.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    this.student.memberships_verbose.forEach(element => {
      if (element.course === form.course) {
        form.membership = element.id
      }
    });
    this.rest.addPayment(form).subscribe(res => {
      const found = this.student.memberships_verbose.some(el => el.course === res.body.membership_verbose.course);
      if (res.status === 201) {
        this.payments.push(res.body)
        if (found) {
         
          this.student.memberships_verbose.forEach(element => {
            if (element.course === res.body.membership_verbose.course) {
              let paidfee: number = 0
              let duefee: number = 0
              paidfee = res.body.amount + element.paid_fee
              duefee = element.due_fee -res.body.amount
              element.paid_fee = paidfee
              element.due_fee=duefee
            element.payments.push(res.body)
              this.configureChart()
            }
          });
        } else {
          this.student.memberships_verbose.push(res.body.membership_verbose)
        }
        this.toastr.success('Paiment a été crée avec success', 'Opération terminée');
        this.paimentModal.hide()

      }

    })
  }
}
