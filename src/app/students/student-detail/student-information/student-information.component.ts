import { Component, OnInit, ViewChild, Input, TemplateRef, } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentModalComponent } from "../../student-modal/student-modal.component";
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component";
import { StudentDetailComponent } from "../student-detail.component";
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css']
})
export class StudentInformationComponent implements OnInit {
  @ViewChild('printModal', { static: false }) printModal: ModalDirective;
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @Input() showDiv: boolean;
  student: any;
  callStudentMosalComponent: boolean = false
  sessions = [];
  payements = [];
  selectedCourse: any
  selectedtrainingName = 'Français';
  lang
  constructor(private translateService: TranslateService, private toastr: ToastrService, private router: Router, public studentDetail: StudentDetailComponent, private rest: RestService) { }

  ngOnInit(): void {
    this.lang=this.translateService.currentLang
    let sessions: any = []
    this.student = this.studentDetail.student
    this.student.memberships_verbose.forEach(element => {
      sessions.push(element)
    });
    this.sessions = sessions
    this.rest.get('/centers/' + this.student.center + "/").subscribe(res => {
      if (res?.status === 200) {
        this.student.center_verbose = res.body
      }
    })
    if (this.sessions.length > 0) {
      this.selectedCourse = this.sessions[0].id
      this.getmemberShipPayment(this.selectedCourse, 1)
    }
  }
  selectCourse() {
    console.log(this.selectedCourse);
    this.payements.length = 0
    this.getmemberShipPayment(this.selectedCourse, 1)
  }
  showprintModal(): void {
    if (this.printModal)
      this.printModal.show();
  }
  onConfirm(event) {
    this.rest.patch('/students/' + this.student.id + "/", { is_active: false }).subscribe(res => {
      if (res?.status === 200) {
        this.router.navigate(['students'])
        this.translateService.get('est supprimé avec success').subscribe(result => {
          this.translateService.get('Opération terminée').subscribe(res => {
            this.toastr.success(this.student.user.family_name + " " + this.student.user.name + result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
          })
        })
      }
    })
  }
  getmemberShipPayment(membershipId, page) {
    this.rest.get('/memberships/' + membershipId + '/payments/?page=' + page).subscribe(res => {
      res.body.results.forEach(element => {
        this.payements.push(element)
      });
      if (res.body.total_pages > page) {
        page++
        this.getmemberShipPayment(membershipId, page)
      }
    })
  }
}
