import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { RestService } from './services/rest.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document, private rest: RestService) {

  }
  ngOnInit() {
    let lang
    if (localStorage.getItem('lang')) {
      lang = localStorage.getItem('lang')
      this.changeLangage(lang)
    } else {
      let decoded: any = jwt_decode(localStorage.getItem('token'));
      console.log(decoded);

      if (decoded.type === "manager" || decoded.type === "agent") {
        this.rest.getCenter(localStorage.getItem('center')).subscribe(res => {
          switch (res.language) {
            case "FR":
              lang = "fr"
              break;
            case "AR":
              lang = "ar"
              break;
          }
          this.changeLangage(lang)
        })
      }
    }
    // let lang
    // if (!localStorage.getItem('lang')) {
    //   this.rest.getCenter(localStorage.getItem('center')).subscribe(res => {
    //     lang = res.language
    //     localStorage.setItem("lang", res.language)
    //   })
    // } else {
    //   lang = this.translateService.getBrowserLang() === "ar" ? "ar" : "fr"
    //   localStorage.setItem("lang", lang)
    // }
    // console.log(lang);

    // this.changeLangage(lang)
  }
  changeLangage(lang: string) {
    localStorage.setItem("lang", lang)
    let htmlTag = this.document.getElementsByTagName(
      "html"
    )[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.changeCssFile(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName(
      "head"
    )[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById(
      "langCss"
    ) as HTMLLinkElement;

    let bundleName = lang === "ar" ? "/arabicStyle.css" : "/englishStyle.css";

    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      // newLink.type = "text/css";
      // newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }
}
