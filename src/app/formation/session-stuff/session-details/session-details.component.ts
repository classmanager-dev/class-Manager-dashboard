import { Component, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { RestService } from "../../../services/rest.service";
import { StudentdetailsComponent } from "./studentdetails/studentdetails.component";
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component"

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  selectedCityName = 'Active';
  param: any
  session: any 
  course: any 
  activateRoute: string
  status = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'No active' },
    
  ];
  @ViewChild('StudentdetailsComponent') StudentdetailsComponent: StudentdetailsComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;

  constructor(private toastr:ToastrService,public route: ActivatedRoute, private rest: RestService) { }

  ngOnInit(): void {
    this.param = this.route.snapshot.params['id']
    let idLength = this.route.snapshot.params['id'].length
    let courseIdLength = this.route.snapshot.params['courseId'].length
    this.activateRoute = window.location.hash.substring(35 + idLength+courseIdLength)
    this.getCourse(this.route.snapshot.params['courseId'])
    this.getSEssion(this.param)

  }
  getSEssion(id) {
    this.rest.getSession(id).subscribe(res => {
      this.session = res
    })
  }
  getCourse(id) {
    this.rest.getCourse(id).subscribe(res => {
      this.course = res
    })
  }
  changeRoute(route) {
    this.activateRoute = route
  }
  onConfirm(event){

this.StudentdetailsComponent.checkedStudents.forEach(element => {
  console.log(this.course.id);
 element.memberships_verbose.forEach(ms => {
   if (ms.course===this.course.id) {
     this.rest.deleteMemership(ms.id).subscribe(res=>{
  if (res.status===204) {
    this.toastr.success('L\'étudiant '+element.user.name + element.user.family_name+' ne suit plus ce cours',"Opération terminée")
    for (let index = 0; index < this.StudentdetailsComponent.students.length; index++) {
      if (this.StudentdetailsComponent.students[index].id===element.id) {
        this.StudentdetailsComponent.students.splice(index,1)
      }
      
    }
    this.deleteModal.deleteModal.hide()
  }
})
   }
 });

  
});
  }
}


