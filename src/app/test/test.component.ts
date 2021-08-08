import { Component, OnInit, } from '@angular/core';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
binding :any
hero :any={}
myConfig  = {
  
  option: {
    minute:false,
    hour:false,
    year:false,
      allowWeek : false,
      allowMonth : false,
      allowYear : false,
  },
  multiple:true
}
  constructor(private localeService: BsLocaleService) { 
    this.localeService.use("fr");

  }

  ngOnInit() {

}
dispaly(){
  console.log(this.hero);
  
}
}
