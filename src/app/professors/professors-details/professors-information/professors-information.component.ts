import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { ProfessorsDetailsComponent } from "../professors-details.component";
import { ManageProfessorsComponent } from "../../manage-professors/manage-professors.component";
@Component({
  selector: 'app-professors-information',
  templateUrl: './professors-information.component.html',
  styleUrls: ['./professors-information.component.css']
})
export class ProfessorsInformationComponent implements OnInit {
@Input() showDiv:boolean
professor
@ViewChild('professorModal') professorModal :ManageProfessorsComponent;

  constructor(public details:ProfessorsDetailsComponent) { }

  ngOnInit(): void {
    this.professor=this.details.professor
  }
  onConfirm(){

  }
}
