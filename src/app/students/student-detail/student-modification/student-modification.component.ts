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
  isLoaded:boolean=false
  constructor(private rest:RestService,private studentdetail:StudentDetailComponent) { }
  ngOnInit(): void {
    this.student=this.studentdetail.student
    this.getLogs(1)
  }
getLogs(page){
  this.rest.get("/students/" +this.student.id + "/logs/?page=" + page).subscribe(res=>{
   if (res.status===200) {
    this.isLoaded=true
    res.body.results.forEach(element => {
      this.logs.push(element)
    });
    if (res.body.total_pages>page) {
      page++
      this.getLogs(page)
    }
   }
  })
}
}
