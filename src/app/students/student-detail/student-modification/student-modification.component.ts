import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-student-modification',
  templateUrl: './student-modification.component.html',
  styleUrls: ['./student-modification.component.css']
})
export class StudentModificationComponent implements OnInit {

  constructor() { }
@Input()student:any
  ngOnInit(): void {
  }

}
