import { Component, OnInit,ViewChild } from '@angular/core';
import { RestService } from "../services/rest.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ManageProfessorsComponent } from "./manage-professors/manage-professors.component";

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css']
})
export class ProfessorsComponent implements OnInit {
  professors: any = []
@ViewChild('professorModal') professorModal :ManageProfessorsComponent;

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
    this.router.navigate(['professeurs/details/' + id])
  }
}
