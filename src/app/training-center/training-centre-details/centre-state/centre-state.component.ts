import { Component, OnInit } from '@angular/core';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";

@Component({
  selector: 'app-centre-state',
  templateUrl: './centre-state.component.html',
  styleUrls: ['./centre-state.component.css']
})
export class CentreStateComponent implements OnInit {
center:any
  constructor(public detail: TrainingCentreDetailsComponent,) { }

  ngOnInit(): void {
    console.log(this.detail.center);
   this.center=this.detail.center
  }

}
