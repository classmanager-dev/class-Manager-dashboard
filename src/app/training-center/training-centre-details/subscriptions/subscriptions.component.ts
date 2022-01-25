import { Component, OnInit } from '@angular/core';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  center: any
  constructor(private centerDeatils:TrainingCentreDetailsComponent,) { 
   
  }

  ngOnInit(): void {
    this.center=this.centerDeatils.center    
  }

}
