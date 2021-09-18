import { Component, OnInit, ViewChild, Input, TemplateRef, } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentModalComponent } from "../../student-modal/student-modal.component";
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component";
import { StudentDetailComponent } from "../student-detail.component";
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private toastr:ToastrService,private router:Router,public studentDetail: StudentDetailComponent, private rest: RestService) { }

  ngOnInit(): void {
    let sessions: any = []
    this.student = this.studentDetail.student
    this.student.memberships_verbose.forEach(element => {
      sessions.push(element)
    });
    this.sessions = sessions
    this.rest.getCenter(this.student.center).subscribe(res => {
      this.student.center_verbose = res
    })
   if (this.sessions.length>0) {
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
    // console.log(this.student);
this.rest.editStudent({is_active:false},this.student.id).subscribe(res=>{
  if (res.status===200) {
    this.router.navigate(['students'])
    this.toastr.success('l\'étudiant  ' + this.student.user.family_name +" "+ this.student.user.name + " est supprimé avec success ", 'Opération terminée')

  }
})
  }
  getmemberShipPayment(membershipId, page) {
    this.rest.getMemberShipPayment(membershipId, page).subscribe(res => {
      console.log(res.body);
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
