import { Component, OnInit, Input } from '@angular/core';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
@Component({
  selector: 'app-training-centre-modification',
  templateUrl: './training-centre-modification.component.html',
  styleUrls: ['./training-centre-modification.component.css']
})
export class TrainingCentreModificationComponent implements OnInit {
  @Input() showModification: boolean;

  constructor(public detail: TrainingCentreDetailsComponent) { }

  ngOnInit(): void {
    console.log(this.detail.center);

  }

}
