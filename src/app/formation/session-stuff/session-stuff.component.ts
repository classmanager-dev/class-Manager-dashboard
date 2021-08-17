import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Location } from "@angular/common";
import { CourseCRUDComponent } from "../session-stuff/course-crud/course-crud.component";
import { RestService } from "../../services/rest.service";
import { ConfirmationModalComponent } from "../../confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-session-stuff',
  templateUrl: './session-stuff.component.html',
  styleUrls: ['./session-stuff.component.css']
})
export class SessionStuffComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @ViewChild('addFormationModal') addFormationModal: CourseCRUDComponent;

  bsConfig: Partial<BsDatepickerConfig>;

  courses: any[] = []
  session: any 
  activateRoute: string
  constructor(private route: ActivatedRoute, private rest: RestService, private location: Location,  private localeService: BsLocaleService,) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }

  ngOnInit(): void {
    this.getCourses(this.route.snapshot.params['id'], 1)
    this.getSession(this.route.snapshot.params['id'])    
  }
  
  getCourses(sessionId, page) {
    this.rest.getCoursesBySession(sessionId, page).subscribe(res => {
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCourses(sessionId, page)
      }
    })
  }
  
 
  getSession(id) {
    this.rest.getSession(id).subscribe(res => {
      this.session = res
      // 
    })
  }
  showModal(){
   if (this.addFormationModal) {
    this.addFormationModal.addFormationModal.show()
    document.querySelector("label[for='selectBase']").classList.add('d-none')
    document.querySelector("option[value='0']").textContent="Selectionner"
    document.querySelector("option[value='3']").textContent="Jour"
    document.querySelector("option[value='4']").textContent="Semaine"
    document.querySelector("option[value='5']").textContent="Mois"
   }
    // document.querySelector("select[formcontrolname='daysOfWeek'] option[value='1: 1']").textContent="Mois"
  }
  onConfirm(event) {
    this.rest.deleteSession(this.route.snapshot.params['id']).subscribe(res => {
      console.log(res);
      this.location.back()

    })
  }

}
