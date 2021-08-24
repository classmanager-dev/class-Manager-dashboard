import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { StudentModalComponent } from "../student-modal/student-modal.component";
import { RestService } from "../../services/rest.service";
import { StudentCoursesComponent } from "./student-courses/student-courses.component";
import { MemebershipModalComponent } from '../memebership-modal/memebership-modal.component';
@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  @ViewChild('studentCourses') studentCourses: StudentCoursesComponent;
  @ViewChild('membershipModal') membershipModal: MemebershipModalComponent;
  student: any
  activateRoute: string
  constructor(private router: Router, private route: ActivatedRoute, private rest: RestService) {

  }

  ngOnInit(): void {
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.hash.substring(19 + idLength)
    
    this.rest.getStudent(this.route.snapshot.params['id']).subscribe(res => {
      this.student = res
    })

  }
  onChange(event) {
    console.log(event);
    this.rest.editStudent({ status: event }, this.route.snapshot.params['id']).subscribe(res => {
      console.log(res);

    })

  }
  changeRoute(route) {
    this.activateRoute = route
  }  
  onConfirm(event){
    console.log(this.studentCourses.showButtons);
    
    this.studentCourses.courses.forEach(element => {
      if (element.checked) {
        console.log(element);
        
      }
    });

  }
}
