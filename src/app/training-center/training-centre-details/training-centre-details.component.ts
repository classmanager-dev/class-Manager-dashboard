import { Component, OnInit } from '@angular/core';
import { RestService } from "../../services/rest.service";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-training-centre-details',
  templateUrl: './training-centre-details.component.html',
  styleUrls: ['./training-centre-details.component.css']
})
export class TrainingCentreDetailsComponent implements OnInit {
  activateRoute: string
  center: any
  selecctedCenter: any
  lang:any
  constructor(private translateService:TranslateService,private rest: RestService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.lang=this.translateService.currentLang
    let idLength = this.route.snapshot.params['id'].length
    this.activateRoute = window.location.hash.substring(25 + idLength)
    if (localStorage.getItem('center')) {
      this.selecctedCenter = localStorage.getItem('center')
    }
    this.rest.get('/centers/' + this.route.snapshot.params['id'] + "/" ).subscribe(res => {
     if (res?.status===200) {
      this.center = res.body
      if (res.body.town) {
        this.rest.get('/towns/'+res.body.town).subscribe(result => {
         if (result.status===200) {
          this.center.town_verbose = result.body
         }
        })
      }
     }
    })
  }
  changeRoute(route) {
    this.activateRoute = route
  }
}
