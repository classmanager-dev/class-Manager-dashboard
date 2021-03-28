import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('accountSettings', { static: false }) accountSettings: ModalDirective;
  @ViewChild('trainingCenters', { static: false }) trainingCenters: ModalDirective;
  centres: any[] = []
  selecctedCenter: any
  listServiceFeature: any = []
  user:any
  userForm: FormGroup;

  constructor(private rest: RestService, private fb: FormBuilder,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
    });
    this.getcenters(1)
    this.getUser()
  }
  getcenters(page) {
    this.rest.getCentres(page).subscribe(res => {
      res.results.forEach(element => {
        this.centres.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getcenters(page)
      }
    })
  }
  getUser(){
    this.rest.getCurrentUser().subscribe(res=>{
      this.user=res
      this.userForm.patchValue({
        name: res.name,
        family_name: res.family_name,
        email: res.email,
      })
    })
  }
  editUser(form){
    this.rest.editUser(form,this.user.id).subscribe(res=>{
      console.log(res);
      Object.assign(this.user,res)
      this.accountSettings.hide()
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
  cancelSelection() {
    this.router.navigate([])
    this.trainingCenters.hide()

  }
}
