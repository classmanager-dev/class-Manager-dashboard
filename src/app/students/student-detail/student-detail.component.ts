import { Component, OnInit ,Input,TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
activateRoute:string='information'
  cities3 = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'No active'},
  ];
  selectedCityName = 'Active';
  constructor(private router:Router,private route:ActivatedRoute) {
    route.url.subscribe(() => {
      this.activateRoute=route.snapshot.firstChild.routeConfig.path
     });
  
   }

  ngOnInit(): void {
    
  }
  changeRoute(route){
    this.activateRoute=route
  }
}
