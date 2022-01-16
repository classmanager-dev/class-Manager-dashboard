import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from "../services/rest.service";
import { ManageCenterComponent } from "./manage-center/manage-center.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker'; @Component({
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
  isLoaded: boolean = false
  centerForm: FormGroup;
  center: any
  bsConfig: Partial<BsDatepickerConfig>;
  @ViewChild('editCenterModal', { static: false }) editCenterModal?: ModalDirective;
  constructor(public rest: RestService, public router: Router, public route: ActivatedRoute, private fb: FormBuilder,private localeService: BsLocaleService) { 
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }

  ngOnInit() {
    this.centerForm = this.fb.group({
      subscription_expiration: new FormControl("", Validators.required),
    });
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      this.getcenters(this.currentPage)
    })

  }
  openModal(center) {
    this.editCenterModal.show()
    this.center = center
    console.log(center);
    console.log(new Date(center.subscription_expiration));

    this.centerForm.patchValue({
      subscription_expiration: new Date(center.subscription_expiration)
    })
  }
  getcenters(page) {
    var requestParams = "";
    this.route.queryParamMap.subscribe(param => {
      if (param.get('search')) requestParams += "&search=" + param.get('search');
    })
    this.rest.get("/centers/?page=" + page + requestParams).subscribe(res => {
      if (res.status === 200) {
        this.isLoaded = true
        this.centers = res.body
        res.body.results.forEach(element => {
         let date =this.manageDate(element.subscription_expiration)
          element.restDays = date 
          this.rest.get('/centers/' + element.id + "/stats").subscribe(result => {
            let student_count: number = 0
            let sessions_count: number = 0
            let courses_count: number = 0
            result.body.stats_by_months.forEach(stat => {
              student_count += stat.students
              sessions_count += stat.sessions
              courses_count += stat.courses
            });
            element.student_count = student_count
            element.sessions_count = sessions_count
            element.courses_count = courses_count
          })
        });

      }
    })
  }
  manageDate(subscription_expiration){
    const oneDay = 24 * 60 * 60 * 1000;
    var date1 = new Date(subscription_expiration)
    var date2 = new Date()
    var date = (date1.getTime() - date2.getTime()) / oneDay
    return date |0
  }
  searchCenter() {
    this.router.navigate(['/traingCentres'], { queryParams: { search: this.search, } });
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/traingCentres'], { queryParams: { page: this.page } });
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
  }
  editCenter(center, event) {
    console.log(event);
    this.rest.patch('/centers/' + center.id + '/', { is_active: event }).subscribe(res => {
      if (res.status === 200) {
        console.log(res);
        Object.assign(center, res.body)
      }

    })
  }
  modifyCenter(form){
    if (this.centerForm.invalid) {
      return
    }
    let date = new Date(form.subscription_expiration)
    this.centerForm.patchValue({ subscription_expiration: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() })
   
    this.rest.patch('/centers/' + this.center.id + '/',this.rest.getDirtyValues(this.centerForm)).subscribe(res => {
      if (res.status === 200) {
        console.log(res);
        Object.assign(this.center, res.body)
        this.center.restDays=this.manageDate(this.center.subscription_expiration)
        this.editCenterModal.hide()
      }

    })
    
}
}