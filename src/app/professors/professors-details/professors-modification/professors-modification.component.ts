import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RestService } from 'src/app/services/rest.service';
import { ProfessorsDetailsComponent } from "../professors-details.component";
@Component({
  selector: 'app-professors-modification',
  templateUrl: './professors-modification.component.html',
  styleUrls: ['./professors-modification.component.css']
})
export class ProfessorsModificationComponent implements OnInit {
  logs: any[] = []
  isloaded: boolean = false
  lang
  constructor(private translateSErvice: TranslateService, private rest: RestService, private details: ProfessorsDetailsComponent) { }
  ngOnInit(): void {
    this.lang = this.translateSErvice.currentLang
    this.getLogs(1, this.details.professor.id)
  }
  getLogs(page, id) {
    this.rest.get("/teachers/" + id + "/logs/?page=" + page).subscribe(res => {
      if (res?.status === 200) {
        this.isloaded = true
        res.body.results.forEach(element => {
          this.logs.push(element)
        });
        if (res.body.total_pages > page) {
          page++
          this.getLogs(page, id)
        }
      }
    })
  }
}
