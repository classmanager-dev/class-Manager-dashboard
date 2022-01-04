import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";

@Component({
  selector: 'app-centre-state',
  templateUrl: './centre-state.component.html',
  styleUrls: ['./centre-state.component.css']
})
export class CentreStateComponent implements OnInit {
  center: any
  isLoaded:boolean=false
  stats:any
  constructor(public detail: TrainingCentreDetailsComponent,private rest:RestService) { }
  ngOnInit(): void {
    this.center = this.detail.center
    this.rest.get('/centers/' +this.center.id + "/stats").subscribe(res=>{      
     if (res.status===200) {
       this.isLoaded=true
      this.stats=res.body.stats_by_months
     }
    })
  }

}
