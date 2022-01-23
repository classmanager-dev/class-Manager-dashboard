import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from 'src/app/services/rest.service';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
@Component({
  selector: 'app-training-centre-modification',
  templateUrl: './training-centre-modification.component.html',
  styleUrls: ['./training-centre-modification.component.css']
})
export class TrainingCentreModificationComponent implements OnInit {
  logs: any 
  isLoaded: boolean = false
  lang : any
  currentPage: any;
  page: number = 1
  constructor(private translateService:TranslateService,private router:Router,private route: ActivatedRoute, private rest: RestService, public detail: TrainingCentreDetailsComponent) { }

  ngOnInit(): void {
    this.lang=this.translateService.currentLang
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      this.getLogs(this.currentPage)
    })
  }
  getLogs(page) {
    this.rest.get("/centers/" + this.detail.center.id + "/logs/?page=" + page).subscribe(res => {
      if (res?.status === 200) {
        this.isLoaded = true
      this.logs=res.body
      }
    })
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/traingCentres/details/'+ this.detail.center.id+'/modification'], { queryParams: { page: this.page } });
  }
}
