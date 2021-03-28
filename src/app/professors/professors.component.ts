import { Component, OnInit } from '@angular/core';
import { RestService } from "../services/rest.service";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css']
})
export class ProfessorsComponent implements OnInit {
  professors: any = []
  constructor(private rest: RestService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getprofessors(1)
  }
  getprofessors(page) {
    this.rest.getProfessors(page).subscribe(res => {
      this.professors = res
    })

  }
  gotoDetails(id) {
    this.router.navigate(['professeurs/details/' + id], { preserveQueryParams: true })
  }
}
