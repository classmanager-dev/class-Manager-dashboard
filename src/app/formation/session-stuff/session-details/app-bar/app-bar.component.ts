import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.css']
})
export class AppBarComponent implements OnInit {
 
  constructor(public route:ActivatedRoute) { }

  ngOnInit(): void {
   
  }

}
