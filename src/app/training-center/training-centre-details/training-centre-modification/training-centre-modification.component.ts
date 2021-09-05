import { Component, OnInit, Input } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
@Component({
  selector: 'app-training-centre-modification',
  templateUrl: './training-centre-modification.component.html',
  styleUrls: ['./training-centre-modification.component.css']
})
export class TrainingCentreModificationComponent implements OnInit {
  logs:any=[]
  constructor(private rest:RestService,public detail: TrainingCentreDetailsComponent) { }

  ngOnInit(): void {
    console.log(this.detail.center);
   this.getLogs(1)
  }
getLogs(page){
  this.rest.getLogs("centers",page,this.detail.center.id).subscribe(res=>{
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
