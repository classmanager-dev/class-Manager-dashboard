import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from "../services/rest.service";
import { ManageCenterComponent } from "./manage-center/manage-center.component";
@Component({
  selector: 'app-training-center',
  templateUrl: './training-center.component.html',
  styleUrls: ['./training-center.component.css']
})
export class TrainingCenterComponent implements OnInit {
  @ViewChild('manageCenter') manageCenter: ManageCenterComponent;
  centers: any
  currentPage: number = 1;
totalPages:any
  constructor( public rest: RestService) { }

  async   ngOnInit() {
    
    this.getcenters(1)

  }
  getcenters(page) {
    this.rest.getCentres(page).subscribe(res => {
      this.centers = res.results
      this.totalPages=res.total_pages
      res.results.forEach(element => {
        this.rest.getStudentsPerCenter(element.id).subscribe(res=>{
          element.students=res.results.length
        })
        this.rest.getSessionsPerCenter(element.id).subscribe(res=>{
          element.sessions=res.results.length
        })
        this.rest.getCoursesPerCenter(element.id).subscribe(res=>{
          element.courses=res.results.length
          console.log(element.courses);
        })
      });
    })
  }
  
  pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }
}
