import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component";
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
import { ManageCenterComponent } from "../../manage-center/manage-center.component";
import { RestService } from "../../../services/rest.service";
import { Router } from "@angular/router";
import { HomeComponent } from 'src/app/home/home.component';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-training-centre-information',
  templateUrl: './training-centre-information.component.html',
  styleUrls: ['./training-centre-information.component.css']
})
export class TrainingCentreInformationComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @ViewChild('manageCenter') manageCenter: ManageCenterComponent;
  @Input() showInformation: boolean
  center: any
  decodedToken:any
  lang:any
  constructor(public detail: TrainingCentreDetailsComponent, private rest: RestService, private router: Router,public home:HomeComponent) { }
  ngOnInit(): void {
    this.center = this.detail.center
    this.lang=this.center.language.toLowerCase()
    this.decodedToken=jwt_decode(localStorage.getItem('token'))
  }
  onConfirm(event) {
    this.rest.patch('/centers/' + this.center.id + '/',{is_active:false}).subscribe(res=>{
      if (res?.status===200) {
        this.router.navigate(['traingCentres'])
      }
    })
  }
}
