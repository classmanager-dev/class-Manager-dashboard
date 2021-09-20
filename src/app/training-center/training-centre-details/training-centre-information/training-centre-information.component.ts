import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component";
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
import { ManageCenterComponent } from "../../manage-center/manage-center.component";
import { RestService } from "../../../services/rest.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HomeComponent } from 'src/app/home/home.component';
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
  constructor(private route:ActivatedRoute,public detail: TrainingCentreDetailsComponent, private rest: RestService, private router: Router,public home:HomeComponent) { }
  ngOnInit(): void {
    this.center = this.detail.center
    console.log("dddddddddddddddddddddddddddddd",this.home.user);

  }
  onConfirm(event) {
    this.rest.editCentres({is_active:false},this.center.id).subscribe(res=>{
      if (res.status===200) {
        this.router.navigate(['traingCentres'])
      }
    })
  }
}
