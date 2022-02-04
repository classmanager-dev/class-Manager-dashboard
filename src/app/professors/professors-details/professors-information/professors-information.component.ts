import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { ProfessorsDetailsComponent } from "../professors-details.component";
import { ManageProfessorsComponent } from "../../manage-professors/manage-professors.component";
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-professors-information',
  templateUrl: './professors-information.component.html',
  styleUrls: ['./professors-information.component.css']
})
export class ProfessorsInformationComponent implements OnInit {
@Input() showDiv:boolean
professor
@ViewChild('professorModal') professorModal :ManageProfessorsComponent;

  constructor(private tostr:ToastrService,private translateService:TranslateService ,private router:Router,private rest:RestService,public details:ProfessorsDetailsComponent) { }

   ngOnInit() {
   console.log(this.showDiv);
   
    this.professor=this.details.professor
    console.log(this.details.professorCourses);
    
    
  }
  onConfirm(event){
    this.rest.delete('/teachers/' + this.professor.id + "/").subscribe(res=>{
      if (res?.status===204) {
        this.translateService.get('la suppression a été effectuée avec success').subscribe(result => {
          this.translateService.get('Opération terminée').subscribe(res => {
            this.tostr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
          })
        })
        this.router.navigate(['professeurs'])
      }
    })
  }
}
