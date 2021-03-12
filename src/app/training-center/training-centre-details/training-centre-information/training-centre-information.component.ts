import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component";
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
import { ManageCenterComponent } from "../../manage-center/manage-center.component";
import { RestService } from "../../../services/rest.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-training-centre-information',
  templateUrl: './training-centre-information.component.html',
  styleUrls: ['./training-centre-information.component.css']
})
export class TrainingCentreInformationComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @ViewChild('manageCenter') manageCenter: ManageCenterComponent;
  @Input() showInformation:boolean
  center:any
  constructor(public detail:TrainingCentreDetailsComponent,private rest:RestService,private router:Router) { }
  ngOnInit(): void {
this.center=this.detail.center
  console.log(this.detail.center);
  
  }
  onConfirm(event){
   this.rest.deleteCenter(this.center.id).subscribe(res=>{
     this.router.navigate(['traingCentres'])
   })    
  }
}
