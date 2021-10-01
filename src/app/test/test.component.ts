import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
binding :any
hero :any={}
testUser = '';
onlineUsers = ['John Doe', 'Jane Smith', 'Alice', 'Bob'];
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
  constructor() { 
  
  }

  ngOnInit() {
    
}
dispaly(){
  console.log(this.hero);
  
}
}
