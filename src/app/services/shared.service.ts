import { Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  lang
  exportList: any[] = [];

  constructor(private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document) { }
  setupLang(center) {
    this.lang = center.language.toLowerCase()
    this.changeLangage(this.lang)
  }
  changeLangage(lang: string) {
    let htmlTag = this.document.getElementsByTagName(
      "html"
    )[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.changeCssFile(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = lang==="ar" ? "arabicStyle.css" : "englishStyle.css";
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
    let bootstrapLink = this.document.getElementById("bootsrap") as HTMLLinkElement;
    lang==="ar"? bootstrapLink.href="https://cdn.rtlcss.com/bootstrap/v4.3.1/css/bootstrap.min.css": bootstrapLink.href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"    
  }
  manageDate(subscription_expiration){
    const oneDay = 24 * 60 * 60 * 1000;
    var date1 = new Date(subscription_expiration)
    var date2 = new Date()
    var date = (date1.getTime() - date2.getTime()) / oneDay
    return date |0
  }
  async exportExcel(data) {
    this.exportList = data
     if (this.exportList.length > 0) {
       import("xlsx").then(xlsx => {
         const worksheet = xlsx.utils.json_to_sheet(this.exportList);
         const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
         console.log(workbook);
        console.log(worksheet);
        
         const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
         this.saveAsExcelFile(excelBuffer, "ExportExcel");
       });
     }
   }
   saveAsExcelFile(buffer: any, fileName: string): void {
     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
     let EXCEL_EXTENSION = '.xlsx';
     const data: Blob = new Blob([buffer], {
       type: EXCEL_TYPE
     });
     FileSaver.saveAs(data, fileName + '_enseignants_' + new Date().getTime() + EXCEL_EXTENSION);
   }
}
