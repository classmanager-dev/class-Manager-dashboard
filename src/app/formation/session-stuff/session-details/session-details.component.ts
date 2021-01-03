import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  htmlStr
  cities3 = [
    {id: 1, name: 'Active',color:"green"},
    {id: 2, name: 'No active',color:"red"},
  ];
  selectedCityName = 'Active';
  constructor(public activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
   
  }
  
  }
  

