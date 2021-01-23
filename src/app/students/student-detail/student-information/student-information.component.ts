import { Component, OnInit, ViewChild, Input, TemplateRef, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { StudentModalComponent } from "../../student-modal/student-modal.component";
@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css']
})
export class StudentInformationComponent implements OnInit {
  @ViewChild('printModal', { static: false }) printModal: ModalDirective;
  @ViewChild('studentModal') studentModal :StudentModalComponent;

  @Input() showDiv: TemplateRef<any>;
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

  constructor() { }

  ngOnInit(): void {
   
  }
  showprintModal(): void {
    if (this.printModal)
      this.printModal.show();
  }
}
