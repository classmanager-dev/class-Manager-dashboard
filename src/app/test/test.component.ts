import { Component, OnInit, } from '@angular/core';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
binding :any

  constructor(private localeService: BsLocaleService) { 
    this.localeService.use("fr");

  }

  ngOnInit() {

}
log(){
  let date =new Date(this.binding)
  console.log(date.toISOString());
  let dates=new Date(date)
  console.log(dates);
  
}

}
