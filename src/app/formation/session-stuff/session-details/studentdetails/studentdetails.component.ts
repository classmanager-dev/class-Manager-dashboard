import { Component, OnInit } from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { RestService } from "../../../../services/rest.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-studentdetails',
  templateUrl: './studentdetails.component.html',
  styleUrls: ['./studentdetails.component.css']
})
export class StudentdetailsComponent implements OnInit {
course:any
students:any=[]
showButtons: boolean = false
checkedStudent
  constructor(private detail:SessionDetailsComponent,private rest:RestService,private router:Router) { }

  ngOnInit(): void {
    this.course=this.detail.course
    this.getcourseStudents(1)    
  }
  getcourseStudents(page){
    this.rest.getCourseStudents(this.course.id,page).subscribe(res=>{
      res.results.forEach(element => {
        this.rest.getStudentPayment(element.id,1).subscribe(res=>{
          res.results.forEach(amount  => {
            element.checked=false
            element.amount=amount.amount 
          });          
        })
        this.students.push(element)
      });
      
    })
    console.log(this.students);
    
  }
  gotoStudents(studentId){
    this.router.navigate(['students/detail/' + studentId])
  }
  showHiddenButtons(event, student) {
   
    student.checked = true
   

  }
  deleteMemeberShip(student){
    console.log(student);
    
  }

}
