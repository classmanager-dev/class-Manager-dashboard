import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { StudentModalComponent } from "../student-modal/student-modal.component";
import { RestService } from "../../services/rest.service";
@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  student: any
  activateRoute: string
  constructor(private router: Router, private route: ActivatedRoute, private rest: RestService) {

  }

  ngOnInit(): void {
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.pathname.substring(18 + idLength)
    console.log(this.activateRoute);
    this.rest.getStudent(this.route.snapshot.params['id']).subscribe(res => {
      this.student = res
    })

  }
  onChange(event){
console.log(event);
this.rest.editStudent({status:event},this.route.snapshot.params['id']).subscribe(res=>{
  console.log(res);
  
})

  }
  changeRoute(route) {
    this.activateRoute = route
  }
}
