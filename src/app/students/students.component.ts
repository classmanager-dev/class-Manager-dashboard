import { Component, OnInit,ViewChild } from '@angular/core';
import { StudentModalComponent } from "./student-modal/student-modal.component";
import { Router } from "@angular/router";
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  showButtons:boolean=false
  @ViewChild('studentModal') studentModal :StudentModalComponent;

  constructor(public router:Router) {
    
   }

  ngOnInit() {
   
  }
  gotoDetails(){
this.router.navigate(['students/detail'])
  }
  showHiddenButtons(event){
    this.showButtons=event
    
  }

}
