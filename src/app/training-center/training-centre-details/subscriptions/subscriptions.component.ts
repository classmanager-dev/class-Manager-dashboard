import { Component, OnInit } from '@angular/core';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private centerDeatils:TrainingCentreDetailsComponent) { }

  ngOnInit(): void {
    console.log(this.centerDeatils.center);
    
  }

}
