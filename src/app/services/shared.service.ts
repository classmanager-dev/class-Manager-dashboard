import { Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  lang
  constructor(private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document) { }
  setupLang(center) {
    this.lang = this.formatLang(center.language)
    this.changeLangage(this.lang)
  }
  formatLang(language) {
    switch (language) {
      case "FR":
        this.lang = "fr"
        break;
      case "AR":
        this.lang = "ar"
        break;
    }
    return this.lang
  }
  changeLangage(lang: string) {
    // localStorage.setItem("lang", lang)
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
    let bundleName = lang === "ar" ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }
}
