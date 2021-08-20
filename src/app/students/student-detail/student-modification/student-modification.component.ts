import { Component, OnInit ,Input} from '@angular/core';
import { RestService } from "../../../services/rest.service";
import { StudentDetailComponent } from "../student-detail.component";
@Component({
  selector: 'app-student-modification',
  templateUrl: './student-modification.component.html',
  styleUrls: ['./student-modification.component.css']
})
export class StudentModificationComponent implements OnInit {
  student:any
  logs:any[]=[]
  constructor(private rest:RestService,private studentdetail:StudentDetailComponent) { }
  ngOnInit(): void {
    this.student=this.studentdetail.student
    this.getLogs(1)
  }
getLogs(page){
  this.rest.getLogs("student",page,this.student.id).subscribe(res=>{
    console.log(res);
    res.results.forEach(element => {
      this.logs.push(element)
    });
    if (res.total_pages>page) {
      page++
      this.getLogs(page)
    }
  })
}
}
