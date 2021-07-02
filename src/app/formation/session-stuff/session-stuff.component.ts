import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from "@angular/router";
import { RestService } from "../../services/rest.service";
import { ConfirmationModalComponent } from "../../confirmation-modal/confirmation-modal.component";
import { Location } from "@angular/common";
@Component({
  selector: 'app-session-stuff',
  templateUrl: './session-stuff.component.html',
  styleUrls: ['./session-stuff.component.css']
})
export class SessionStuffComponent implements OnInit {
  @ViewChild('addFormationModal', { static: false }) addFormationModal: ModalDirective;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;

  courses: any[] = []
  session:any={}
  activateRoute: string
  constructor(private route: ActivatedRoute, private rest: RestService,private location:Location) { }

  ngOnInit(): void {
    this.getCourses(this.route.snapshot.params['id'], 1)
    this.getSession(this.route.snapshot.params['id'])
  }
  getCourses(sessionId, page) {
    this.rest.getCoursesBySession(sessionId, page).subscribe(res => {
      console.log(res);
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCourses(sessionId, page)
      }
    })
  }
  getSession(id){
    this.rest.getSession(id).subscribe(res=>{
      console.log(res);
      this.session=res
    })
  }
  onConfirm(event){
    this.rest.deleteSession(this.route.snapshot.params['id']).subscribe(res=>{
      console.log(res);
      this.location.back()
      
    })
    
      }
 
}
