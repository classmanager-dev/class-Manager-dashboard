import { Component, OnInit,Input,TemplateRef } from '@angular/core';

@Component({
  selector: 'app-student-paiments',
  templateUrl: './student-paiments.component.html',
  styleUrls: ['./student-paiments.component.css']
})
export class StudentPaimentsComponent implements OnInit {
  @Input() showDiv: TemplateRef<any>;
  constructor() { }
  collapse:boolean=false
  isCollapsed = true;

  ngOnInit(): void {
  }

}
