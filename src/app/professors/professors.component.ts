import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from "../services/rest.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ManageProfessorsComponent } from "./manage-professors/manage-professors.component";

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css']
})
export class ProfessorsComponent implements OnInit {
  professors: any
  isLoaded: boolean = false
  search: any
  currentPage: number;
  page: number = 1
  @ViewChild('professorModal') professorModal: ManageProfessorsComponent;
  constructor(private rest: RestService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      this.getTeachers(this.currentPage)
    })

  }
  
  getTeachers(page){
    this.rest.getProfessors(page).subscribe(res => {
      if (res.status === 200) {
        this.professors = res.body
        this.isLoaded = true
      }
    })
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/professeurs'], { queryParams: { page: this.page } });
  }
  searchCenter() {
    this.router.navigate(['/professeurs'], { queryParams: { search: this.search, } });
  }
  gotoDetails(id) {
    this.router.navigate(['professeurs/details/' + id])
  }
}
