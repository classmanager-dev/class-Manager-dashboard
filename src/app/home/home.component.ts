import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
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
  user: any
  userForm: FormGroup;
  currentRoute
  constructor(private rest: RestService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    this.userForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
    });
    await this.getUser()
    if (this.user.type === "admin") {
      this.getcenters(1)
      if (localStorage.getItem('center')) {
        this.selecctedCenter = localStorage.getItem('center')
    console.log(this.selecctedCenter);

      }
    }
  }
  getcenters(page) {
    this.rest.authRefresh(this.rest.getCentres(page)).subscribe((res: any) => {
      res.results.forEach(element => {
        this.centres.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getcenters(page)
      }
    })
  }
  async getUser() {
    await this.rest.getCurrentUser().toPromise().then(res => {
      this.user = res
      this.userForm.patchValue({
        name: res.name,
        family_name: res.family_name,
        email: res.email,
      })
    })
  }
  editUser(form) {
    this.rest.editUser(form, this.user.id).subscribe(res => {
      Object.assign(this.user, res)
      this.accountSettings.hide()
    })

  }
  chooseCenter(event, centerId) {
    if (event) {
      this.selecctedCenter = centerId
    }
  }
  selectCenter() {
    localStorage.setItem('center', this.selecctedCenter)
    let currentPath: any
    currentPath = this.router.url
    this.router.navigate([""])

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
    localStorage.removeItem('center')
    this.router.navigate([""])
    this.selecctedCenter = null
    this.trainingCenters.hide()

  }
  logoutFunction() {
    localStorage.clear()
    this.router.navigate(["login"])
  }
}
