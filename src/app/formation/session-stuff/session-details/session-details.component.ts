import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  selectedCityName = 'Active';
  constructor(public activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
   
  }
  
  }
  

