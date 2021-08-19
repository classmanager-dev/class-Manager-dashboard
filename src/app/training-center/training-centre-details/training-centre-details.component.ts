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
    let idLength=this.route.snapshot.params['id'].length
    this.activateRoute=window.location.hash.substring(25+idLength)
   console.log(this.activateRoute);
   
  this.rest.getCenter(this.route.snapshot.params['id']).subscribe(res=>{
    this.center=res
    this.rest.getTown(res.town).subscribe(result=>{
      this.center.town_verbose=result
    })
    
  })
  }
  changeRoute(route){
    this.activateRoute=route
  }
}
