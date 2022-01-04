import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { SessionDetailsComponent } from "../../session-details/session-details.component";
@Component({
  selector: 'app-modifcation',
  templateUrl: './modifcation.component.html',
  styleUrls: ['./modifcation.component.css']
})
export class ModifcationComponent implements OnInit {
  course:any
  logs:any[]=[]
  isloaded:boolean=false
  constructor(private sessiondetail:SessionDetailsComponent,private rest:RestService) { }

  ngOnInit(): void {
    this.course=this.sessiondetail.course
  this.getLogs(1)
  }
getLogs(page){
  this.rest.get("/courses/" + this.course.id + "/logs/?page=" + page).subscribe(res=>{
   if (res?.status===200) {
    this.isloaded=true
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
