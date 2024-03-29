import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentDetailComponent } from "../student-detail.component";
import { RestService } from "../../../services/rest.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-student-paiments',
  templateUrl: './student-paiments.component.html',
  styleUrls: ['./student-paiments.component.css']
})
export class StudentPaimentsComponent implements OnInit {
  @Input() showDiv: any;
  @ViewChild('paimentModal', { static: false }) paimentModal: ModalDirective;
  @ViewChild('deletePaymentModal', { static: false }) deletePaymentModal: ModalDirective;
  isLoaded: boolean = false
  courses: any = []
  paiment: FormGroup;
  deletePayment: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private tostr: ToastrService, private translateService: TranslateService, private toastr: ToastrService, private datePipe: DatePipe, public studentDetail: StudentDetailComponent, private rest: RestService, private fb: FormBuilder, private localeService: BsLocaleService) {
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
  public pieChartColors = [
    {
      backgroundColor: ['#0049C9', '#dee2e6', 'rgba(0,0,255,0.3)'],
    },
  ];
  student: any
  submit: boolean = false
  payments: any[] = []
  memeberships: any[] = []
  memebership: any
  ngOnInit(): void {
    this.student = this.studentDetail.student
    this.paiment = this.fb.group({
      course: new FormControl(null, Validators.required),
      amount: new FormControl("", Validators.required),
      student: this.student.id,
      center: this.student.center,
      date: new FormControl(new Date(), Validators.required),
      note: new FormControl("",),
      reference: "string"
    });
    this.deletePayment = this.fb.group({
      course: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
    });
    if (this.student) {
      this.getStudentCourses(1)
      this.getPayment(1)
    }
  }
  get f() { return this.paiment.controls }
  get g() { return this.deletePayment.controls }
  addPaiment() {
    this.paimentModal.show()
    this.submit = false
  }

  getPayment(page) {
    this.memeberships = this.student.memberships_verbose
    if (this.student.memberships_verbose.length > 0) {
      this.student.memberships_verbose.forEach(element => {
        this.getMemberShipPayment(element, 1)
      });
    } else {
      this.isLoaded = true
    }
    this.configureChart()
  }
  configureChart() {
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
    this.rest.get('/students/' + this.student.id + "/courses/?page=" + page).subscribe(res => {
      if (res?.status === 200) {
        res.body.results.forEach(element => {
          this.courses.push(element)
        });
        if (res.body.total_pages > page) {
          page++
          this.getStudentCourses(page)
        }
      }
    })
  }
  getMemberShipPayment(membership, page) {
    this.rest.get('/memberships/' + membership.id + '/payments/?page=' + page).subscribe(res => {
      if (res?.status === 200) {
        this.isLoaded = true
        let array: any[] = []
        res.body.results.forEach(element => {
          array.push(element)
        });
        membership.payments = array
        if (res.body.total_pages > page) {
          page++
          this.getMemberShipPayment(membership, page)
        }
      }
    })
  }
  selectCourse() {
    this.memeberships.forEach(element => {
      if (element.course === this.deletePayment.get('course').value) {
        this.memebership = element
      }
    });
  }
  openDeletePaymentModal() {
    this.submit = false
    this.paiment.reset()
    this.deletePaymentModal.show()
  }
  addPayment(form) {
    let due_fee
    this.memeberships.forEach(element => {
      if (element.course === this.paiment.get('course').value) {
        due_fee = element.due_fee
      }
    });
    this.paiment.controls["amount"].setValidators([Validators.required, Validators.max(due_fee)])
    this.paiment.controls['amount'].updateValueAndValidity()
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
    this.rest.post('/payments/', form).subscribe(res => {
      const found = this.student.memberships_verbose.some(el => el.course === res.body.membership_verbose.course);
      if (res.status === 201) {
        this.payments.push(res.body)
        if (found) {

          this.student.memberships_verbose.forEach(element => {
            if (element.course === res.body.membership_verbose.course) {
              let paidfee: number = 0
              let duefee: number = 0
              paidfee = res.body.amount + element.paid_fee
              duefee = element.due_fee - res.body.amount
              element.paid_fee = paidfee
              element.due_fee = duefee
              element.payments.push(res.body)
              this.configureChart()
            }
          });
        } else {
          this.student.memberships_verbose.push(res.body.membership_verbose)
        }
        this.translateService.get('Paiment a été crée avec success').subscribe(result => {
          this.translateService.get('Opération terminée').subscribe(res => {
            this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
          })
        })
        this.paimentModal.hide()

      }

    })
  }
  deletePaiment(form) {
    this.submit = true
    if (this.deletePayment.invalid) {
      return
    }
    console.log(form);
    this.rest.delete('/payments/' + form.amount + '/').subscribe(res => {
      if (res?.status === 204) {
        this.translateService.get('la suppression a été effectuée avec success').subscribe(result => {
          this.translateService.get('Opération terminée').subscribe(res => {
            this.tostr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
            this.memeberships.forEach(element => {
              for (let index = 0; index < element.payments.length; index++) {
                if (element.payments[index].id === form.amount) {
                  console.log(element.payments[index]);
                  let paidfee: number = 0
                  let duefee: number = 0
                  paidfee = element.paid_fee - element.payments[index].amount
                  duefee = element.due_fee + element.payments[index].amount
                  element.paid_fee = paidfee
                  element.due_fee = duefee
                  element.payments.splice(index, 1)
                  this.deletePaymentModal.hide()
                  this.configureChart()
                }
              }
            });
          })
        })
      }
    })

  }
}
