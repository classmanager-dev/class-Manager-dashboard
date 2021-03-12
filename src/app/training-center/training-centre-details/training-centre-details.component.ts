import { Component, OnInit } from '@angular/core';
import { RestService } from "../../services/rest.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-training-centre-details',
  templateUrl: './training-centre-details.component.html',
  styleUrls: ['./training-centre-details.component.css']
})
export class TrainingCentreDetailsComponent implements OnInit {
  activateRoute:string
  center:any
  constructor(private rest:RestService,private route:ActivatedRoute) {
   }

  ngOnInit(): void {
    this.activateRoute=window.location.pathname.substring(26)
  this.rest.getCenter(this.route.snapshot.params['id']).subscribe(res=>{
    this.center=res
// console.log(this.center);
    
  })
  }
  changeRoute(route){
    this.activateRoute=route
  }
}
