import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { ProfessorsDetailsComponent } from "../professors-details.component";
import { ManageProfessorsComponent } from "../../manage-professors/manage-professors.component";
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-professors-information',
  templateUrl: './professors-information.component.html',
  styleUrls: ['./professors-information.component.css']
})
export class ProfessorsInformationComponent implements OnInit {
@Input() showDiv:boolean
professor
@ViewChild('professorModal') professorModal :ManageProfessorsComponent;

  constructor(private router:Router,private rest:RestService,public details:ProfessorsDetailsComponent) { }

   ngOnInit() {
   console.log(this.showDiv);
   
    this.professor=this.details.professor
    console.log(this.details.professorCourses);
    
    
  }
  onConfirm(event){
    this.rest.patch('/teachers/' + this.professor.id + "/",{is_active:false}).subscribe(res=>{
      if (res?.status===200) {
        this.router.navigate(['professeurs'])
      }
    })
  }
}
