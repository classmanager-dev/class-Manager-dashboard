import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  selectedCityName = 'Active';
  param:any
  constructor(public route:ActivatedRoute) { }

  ngOnInit(): void {
  this.param=this.route.snapshot.params['id']
  console.log(this.param);
  
  }
  
  }
  

