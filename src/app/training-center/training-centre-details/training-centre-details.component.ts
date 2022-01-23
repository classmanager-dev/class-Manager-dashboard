import { Component, OnInit } from '@angular/core';
import { RestService } from "../../services/rest.service";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import jwt_decode from "jwt-decode";
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
  decodedToken
  constructor(private translateService:TranslateService,private rest: RestService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.url.subscribe((res) => {
      switch (this.route.snapshot.firstChild.component['name']) {
        case "TrainingCentreInformationComponent":
          this.activateRoute = "information"
          break;
        case "CentreStateComponent":
          this.activateRoute = "centre-state"
          break;
        case "TrainingCentreModificationComponent":
          this.activateRoute = "modification"
          break;
      }
    });
    this.lang=this.translateService.currentLang
    if (localStorage.getItem('center')) {
      this.selecctedCenter = localStorage.getItem('center')
    }
    this.decodedToken=jwt_decode(localStorage.getItem('token'))
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
