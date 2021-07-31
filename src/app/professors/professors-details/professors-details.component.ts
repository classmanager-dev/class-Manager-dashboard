import { Component, OnInit } from '@angular/core';
import { RestService } from "../../services/rest.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-professors-details',
  templateUrl: './professors-details.component.html',
  styleUrls: ['./professors-details.component.css']
})
export class ProfessorsDetailsComponent implements OnInit {
  professor:any
  activateRoute:string

  constructor(private rest:RestService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute=window.location.pathname.substring(24)
    console.log(this.activateRoute);
    
    this.rest.getProfessor(this.route.snapshot.params['id']).subscribe(res=>{
      console.log(res);
      this.professor=res
    })
  }
  changeRoute(route){
    this.activateRoute=route
  }
  
}
