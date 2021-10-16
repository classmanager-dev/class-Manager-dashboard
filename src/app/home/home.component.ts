import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { MustMatch } from '../_helpers/must-match.validator';
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
  seleccted: any
  listServiceFeature: any = []
  user: any
  userForm: FormGroup;
  resetPasswordForm: FormGroup;
  currentRoute
  manager: any
  submit:boolean=false
  constructor(private rest: RestService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    this.userForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
    });
    this.resetPasswordForm = this.fb.group({
      oldPasword: new FormControl("", Validators.required),
      newPassword: new FormControl("", Validators.required),
      confirmedPassword: new FormControl("", [Validators.required]),
    }, {
      validator: MustMatch('newPassword', 'confirmedPassword')
    });
    await this.getUser()
    switch (this.user.type) {
      case "admin":
        this.getcenters(1)
        break;
      case "manager":
        await this.rest.getCurrentManager().toPromise().then(res => {
          this.manager = res
          this.selecctedCenter = res.center
          localStorage.setItem('center', res.center)
        })
        break;
      case "agent":
        await this.rest.getCurrentAgent().toPromise().then(res => {
          this.manager = res
          this.selecctedCenter = res.center
          localStorage.setItem('center', res.center)
        })

        break;

    }
    if (localStorage.getItem('center')) {
      this.selecctedCenter = localStorage.getItem('center')
      this.seleccted = this.selecctedCenter
    }
  }
  get f() { return this.resetPasswordForm.controls }
  getcenters(page) {
    this.rest.getCentres(page).subscribe((res: any) => {
      res.body.results.forEach(element => {
        this.centres.push(element)
      });
      if (res.body.total_pages > page) {
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
    switch (this.user.type) {
      case "manager":
        this.rest.editManager({ user: this.rest.getDirtyValues(this.userForm) }, this.manager.id).subscribe(res => {
          if (res.status === 200) {
            console.log(res);

            Object.assign(this.user, res.body.user)
            this.accountSettings.hide()
          }
        })
        break;
      case "agent":
        this.rest.editAgent({ user: this.rest.getDirtyValues(this.userForm) }, this.manager.id).subscribe(res => {
          if (res.status === 200) {
            Object.assign(this.user, res.body.user)
            this.accountSettings.hide()
          }
        })
        break;
      case "admin":
        this.rest.editUser({ user: this.rest.getDirtyValues(this.userForm) }, this.user.id).subscribe(res => {
          if (res.status === 200) {
            Object.assign(this.user, res.body.user)
            this.accountSettings.hide()
          }
        })

        break;
    }
  }
  chooseCenter(event, centerId) {
    if (event) {
      this.seleccted = centerId
      console.log(this.seleccted);

    }
  }
  selectCenter() {
    this.selecctedCenter = this.seleccted
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
  resetPassword(form){
    this.submit=true
    if (this.resetPasswordForm.invalid) {
      return
    }
    this.rest.authBasic({email:this.user.email,password:form.oldPasword}).subscribe(res=>{
      console.log(res);
      if (res.status===200) {
        this.rest.editUser({password:form.newPassword},this.user.id).subscribe(res=>{
          console.log(res);
          
        })
      }
      
    })
    
  }
}
