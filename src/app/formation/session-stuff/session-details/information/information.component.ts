import { Component, OnInit ,Input,ViewChild} from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { CourseCRUDComponent } from "../../course-crud/course-crud.component";
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Input() showDiv: boolean;
  @ViewChild('addFormationModal') addFormationModal: CourseCRUDComponent;

  course:any
  constructor(public sdetails:SessionDetailsComponent) { }
  ngOnInit(): void {
    this.course=this.sdetails.course
    console.log(this.course);
    
  }

}
