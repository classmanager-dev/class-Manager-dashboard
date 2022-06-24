import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './services/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public sharedService: SharedService, private translateSErvice: TranslateService) {

  }
  ngOnInit() {        
    if (localStorage.getItem('lang')) {
      this.sharedService.changeLangage(localStorage.getItem('lang'))

    } else {
     if (!localStorage.getItem('token')) {
      let lang
      this.translateSErvice.getBrowserLang() === "ar" ? lang="ar": lang="fr"
      this.sharedService.changeLangage(lang) 
      localStorage.setItem("lang",lang)
     }
    }
  }

}
