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
  currentPage: number;
  page: number = 1
  search: any
  isLoaded:boolean=false
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
     if (res.status===200) {
       this.isLoaded=true
      this.centers = res.body     
      // res.body.results.forEach(element => {
      //   let student_count: number = 0
      //   let sessions_count: number = 0
      //   let courses_count: number = 0
      //   element.stats.forEach(stat => {
      //     student_count += stat.students
      //     sessions_count += stat.sessions
      //     courses_count += stat.courses
      //   });
      //   element.student_count = student_count
      //   element.sessions_count = sessions_count
      //   element.courses_count = courses_count
      // });
     }
    })
  }
  searchCenter() {   
        this.router.navigate(['/traingCentres'], { queryParams: { search: this.search, }});
      }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/traingCentres'], { queryParams: { page: this.page } });
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }
}
