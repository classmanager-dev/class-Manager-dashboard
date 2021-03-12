import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('accountSettings', { static: false }) accountSettings: ModalDirective;
  @ViewChild('trainingCenters', { static: false }) trainingCenters: ModalDirective;
  centres:any []=[]
  selecctedCenter: any
  listServiceFeature: any = []
  constructor(private rest: RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getcenters(1)
  }
  getcenters(page) {
    this.rest.getCentres(page).subscribe(res => {
      res.results.forEach(element => {
        this.centres.push(element)
      });
if (res.total_pages>page ) {
  page++
  this.getcenters(page)
}
    })
  }
  chooseCenter(event, centerId) {
    if (event) {
      this.selecctedCenter = centerId
    }
  }
  selectCenter() {
   this.router.navigate([], { queryParams: { center: this.selecctedCenter } })
   this.trainingCenters.hide()
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "310px";
    document.getElementById("overlay").classList.add('active')
  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("overlay").classList.remove('active')

  }
  cancelSelection(){
    this.router.navigate([])
   this.trainingCenters.hide()

  }
}
