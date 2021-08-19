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
  professorCourses:any=[]
  constructor(private rest:RestService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.hash.substring(23 + idLength)    
    this.rest.getProfessor(this.route.snapshot.params['id']).subscribe(res=>{
      this.professor=res
      this.getProfessorCourses(res.id,1)
    })
  }
  changeRoute(route){
    this.activateRoute=route
  }
  getProfessorCourses(id,page){
    this.rest.getProfessorCourses(id,page).subscribe(res=>{
      res.results.forEach(element => {
        this.professorCourses.push(element)
      });
if (res.total_pages>page) {
  page++
  this.getProfessorCourses(id,page)
}
    })
  }
  onChange(event){
    console.log(event);
    this.rest.editTeacher({status:event},this.route.snapshot.params['id']).subscribe(res=>{
      console.log(res);
      
    })}
  
}
