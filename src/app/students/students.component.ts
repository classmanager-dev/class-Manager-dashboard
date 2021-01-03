import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  showButtons:boolean=false
  constructor() { }

  ngOnInit() {
  }
  showHiddenButtons(event){
    this.showButtons=event
    
  }
}
