import { Component, OnInit, Input ,ViewChild,} from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { RestService } from "../../../../services/rest.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-studentdetails',
  templateUrl: './studentdetails.component.html',
  styleUrls: ['./studentdetails.component.css']
})
export class StudentdetailsComponent implements OnInit {
  course: any
  students: any = []
  checkedStudents: any[] = []
  showButton:boolean=false

  constructor(private toatsr:ToastrService,private detail: SessionDetailsComponent, private rest: RestService, private router: Router) { }

  ngOnInit(): void {
    this.course = this.detail.course
    this.getcourseStudents(1)
  }
  getcourseStudents(page) {
    this.rest.getCourseStudents(this.course.id, page).subscribe(res => {
      res.results.forEach(element => {
        this.rest.getStudentPayment(element.id, 1).subscribe(res => {
          res.results.forEach(amount => {
            element.checked = false
            element.amount = amount.amount
          });
        })
        this.students.push(element)
      });

    })
    console.log(this.students);

  }
  gotoStudents(studentId) {
    this.router.navigate(['students/detail/' + studentId])
  }
  showHiddenButtons(event, student) {
    const { length } = this.checkedStudents;
    const id = length + 1;
    const found = this.checkedStudents.some(el => el.id === student.id);
    if (event) {
      if (!found) this.checkedStudents.push(student);
      student.checked = true
    }
    else {
      if (found) {
        for (let index = 0; index < this.checkedStudents.length; index++) {
          if (this.checkedStudents[index].id === student.id) {
            this.checkedStudents.splice(index, 1)
          }

        }
      }
    }
    
  }
  
  
  onConfirm(event) {
    console.log(this.checkedStudents);
    console.log(this.students);
    
    console.log(event);
    
    // this.checkedStudents.forEach(element => {
    //   this.rest.deleteMemership(element.id).subscribe(res=>{
    //     if (res.status===204) {
    //       this.toatsr.success('L\'étudiant ne suit plus ce cours',"Opération terminée")
    //     }
    //   })

    // });

  }

}
