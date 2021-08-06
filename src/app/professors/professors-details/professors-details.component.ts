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
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.pathname.substring(22 + idLength)    
    this.rest.getProfessor(this.route.snapshot.params['id']).subscribe(res=>{
      this.professor=res
    })
  }
  changeRoute(route){
    this.activateRoute=route
  }
  onChange(event){
    console.log(event);
    this.rest.editTeacher({status:event},this.route.snapshot.params['id']).subscribe(res=>{
      console.log(res);
      
    })}
  
}
