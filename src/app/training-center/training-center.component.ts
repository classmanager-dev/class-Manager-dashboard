import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from "../services/rest.service";
import { ManageCenterComponent } from "./manage-center/manage-center.component";
import { Router, Route, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-training-center',
  templateUrl: './training-center.component.html',
  styleUrls: ['./training-center.component.css']
})
export class TrainingCenterComponent implements OnInit {
  @ViewChild('manageCenter') manageCenter: ManageCenterComponent;
  centers: any
  currentPage: number ;
  page: number = 1

  constructor(public rest: RestService, public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      this.getcenters(this.currentPage)
    })

  }
  getcenters(page) {
    this.rest.getCentres(page).subscribe(res => {
      this.centers = res      
      res.results.forEach(element => {
        this.rest.getStudentsByCenter(element.id, 1).subscribe(res => {
          element.students = res.results.length
        })
        this.rest.getSessionsByCenter(element.id, 1).subscribe(res => {
          element.sessions = res.results.length
        })
        this.rest.getCoursesByCenter(element.id, 1).subscribe(res => {
          element.courses = res.results.length
        })
      });
    })
  }

  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/traingCentres'], { queryParams: { page: this.page } });
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }
}
