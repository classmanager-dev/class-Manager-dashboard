import { Component, OnInit, ViewChild, Input, TemplateRef, } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentModalComponent } from "../../student-modal/student-modal.component";
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component";
import { StudentDetailComponent } from "../student-detail.component";
@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css']
})
export class StudentInformationComponent implements OnInit {
  @ViewChild('printModal', { static: false }) printModal: ModalDirective;
  @ViewChild('studentModal') studentModal :StudentModalComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @Input() showDiv: boolean;
  @Input() student: any;
  callStudentMosalComponent:boolean=false
  session = [
    {id: 1, name: 'Hiver 2020'},
    {id: 2, name: 'No active'},
  ];
  training=[
    {id: 1, name: 'Français'},
    {id: 2, name: 'No active'},
  ];
  selectedCityName = 'Hiver 2020';
  selectedtrainingName = 'Français';

  constructor(public studentDetail:StudentDetailComponent) { }

  ngOnInit(): void {
  this.student=this.studentDetail.student
  
  }
  showprintModal(): void {
    if (this.printModal)
      this.printModal.show();
  }
  onConfirm(event){
console.log(this.student);

  }
}
