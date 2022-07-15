import { Component, OnInit, } from '@angular/core';
import * as FileSaver from 'file-saver';
import { RestService } from "../services/rest.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  exportList: any[] = [];
  constructor(private rest: RestService,) {
    // this.dummyData(1);
  }
  ngOnInit(): void {
  }
  async dummyData(page) {
   await this.rest.get('/centers/1/teachers/?page=' + page).toPromise().then(res => {
      let teachers: any = []
      res.body.results.forEach(element => {
        teachers.push(element.user)
      });
      if (res.body.feer > page) {
        page++
        this.dummyData(page)
      }
      this.exportList = teachers
      //  console.log(this.exportList);
    })
  }
  async exportExcel() {
   await this.dummyData(1)   
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
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


}

