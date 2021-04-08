import { Component, OnInit,ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { HomeComponent } from "../home/home.component";
import { RestService } from "../services/rest.service";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('manager', { static: false }) manager: ModalDirective;
  center:any
  constructor(public home:HomeComponent,private rest:RestService) { }

  ngOnInit() {
    if (localStorage.getItem('center')) {
      this.rest.getCenter(localStorage.getItem('center')).subscribe(res=>{
        this.center=res
      })
    }else{
      this.home.trainingCenters.show()
    }
  }

}
