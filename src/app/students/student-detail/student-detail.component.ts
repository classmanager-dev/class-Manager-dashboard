import { Component, OnInit ,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { StudentModalComponent } from "../student-modal/student-modal.component";
import { RestService } from "../../services/rest.service";
@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  student:any
activateRoute:string='information'
  cities3 = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'No active'},
  ];
  selectedCityName = 'Active';
  constructor(private router:Router,private route:ActivatedRoute,private rest:RestService) {
    
   }

  ngOnInit(): void {
   
    this.rest.getStudent(this.route.snapshot.params['id']).subscribe(res=>{
      console.log(res);
      this.student=res
    })

  }
  changeRoute(route){
    this.activateRoute=route
  }
}
