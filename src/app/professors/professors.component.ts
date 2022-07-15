import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from "../services/rest.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ManageProfessorsComponent } from "./manage-professors/manage-professors.component";
import { SharedService } from '../services/shared.service';

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
  exportList: any[] = [];
  @ViewChild('professorModal') professorModal: ManageProfessorsComponent;
  constructor(private rest: RestService, private router: Router, private route: ActivatedRoute,private sharedService:SharedService) { }
  ngOnInit() {
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      
      if (param.get('search')) {
        this.search=param.get('search')
      }
      this.getTeachers(this.currentPage)
    })
  }
  async exportExcel() {
    await this.getallTeachers(1)   
    this.sharedService.exportExcel( this.exportList);
   }
   async getallTeachers(page) {
    if ( localStorage.getItem("center")) {
      await this.rest.get('/centers/'+ localStorage.getItem("center")+'/teachers/?page=' + page).toPromise().then(res => {
        let teachers: any = []
        res.body.results.forEach(element => {
          teachers.push(element.user)
        });
        if (res.body.feer > page) {
          page++
          this.getallTeachers(page)
        }
        this.exportList = teachers
      })
    }else{
      await this.rest.get('/teachers/?page=' + page).toPromise().then(res => {
        let teachers: any = []
        res.body.results.forEach(element => {
          teachers.push(element.user)
        });
        if (res.body.feer > page) {
          page++
          this.getallTeachers(page)
        }
        this.exportList = teachers
      })
    }

   } 
 
  getTeachers(page){
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
   if ( localStorage.getItem("center")) {
    this.rest.get( '/centers/' + localStorage.getItem("center") + '/teachers/?page=' + page + requestParams).subscribe(res => {
      if (res?.status === 200) {
        this.professors = res.body
        res.body.results.forEach(element => {
          this.rest.get('/teachers/' + element.id + '/courses/?page=' + 1,).subscribe(results=>{
           if (results?.status===200) {
            element.courses=results.body.results
           }
          })
        });
        this.isLoaded = true
      }
    })
   } else {
    this.rest.get('/teachers/?page=' + page + requestParams,).subscribe(res => {
      if (res?.status === 200) {
        this.professors = res.body
        res.body.results.forEach(element => {
          this.rest.get('/teachers/' + element.id + '/courses/?page=' + 1,).subscribe(results=>{
            if (results?.status===200) {
             element.courses=results.body.results
            }
           })
        });
        this.isLoaded = true
      }
    })
   }
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
