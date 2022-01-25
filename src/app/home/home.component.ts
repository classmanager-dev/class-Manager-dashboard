import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { ActivatedRoute, Router, } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { MustMatch } from '../_helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../services/shared.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})
export class HomeComponent implements OnInit {
  @ViewChild('accountSettings', { static: false }) accountSettings: ModalDirective;
  @ViewChild('trainingCenters', { static: false }) trainingCenters: ModalDirective;
  @ViewChild('changePassword', { static: false }) changePassword: ModalDirective;
  centres: any[] = []
  selecctedCenter: any
  seleccted: any
  listServiceFeature: any = []
  user: any
  userForm: FormGroup;
  resetPasswordForm: FormGroup;
  currentRoute
  manager: any
  submit: boolean = false
  isLoaded: boolean = false
  constructor(private translateService: TranslateService, private sharedService: SharedService, public toastr: ToastrService, private rest: RestService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }
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
    switch (this.user?.type) {
      case "admin":
        this.getcenters(1)
        this.sharedService.changeLangage('fr')
        break;
      case "manager":
        await this.rest.get('/managers/current/').toPromise().then(res => {
          if (res?.status === 200) {
            this.manager = res.body
            this.sharedService.setupLang(res.body.center_verbose)
            this.selecctedCenter = res.body.center
            localStorage.setItem('center', res.body.center)
          }
        })
        break;
      case "agent":
        await this.rest.get('/agents/current/').toPromise().then(res => {
          if (res?.status === 200) {
            this.manager = res.body
            this.selecctedCenter = res.body.center
            localStorage.setItem('center', res.body.center)
          }
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
    this.rest.get("/centers/?page=" + page).subscribe((res: any) => {
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
    await this.rest.get('/users/current/').toPromise().then(res => {
      if (res?.status === 200) {
        this.user = res.body
        setTimeout(() => {
          this.isLoaded = true
        }, 500);
        
        this.userForm.patchValue({
          name: res.body.name,
          family_name: res.body.family_name,
          email: res.body.email,
        })
      }
    })
  }
  editUser(form) {
    switch (this.user.type) {
      case "manager":
        this.rest.patch('/managers/' + this.manager.id + "/", { user: this.rest.getDirtyValues(this.userForm) }).subscribe(res => {
          if (res.status === 200) {
            Object.assign(this.user, res.body.user)
            this.translateService.get('utilisateur a été modifié avec success').subscribe(result => {
              this.translateService.get('Opération terminée').subscribe(res => {
                this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            this.accountSettings.hide()
          }
        })
        break;
      case "agent":
        this.rest.patch('/agents/' + this.manager.id + "/", { user: this.rest.getDirtyValues(this.userForm) }).subscribe(res => {
          if (res.status === 200) {
            Object.assign(this.user, res.body.user)
            this.translateService.get('utilisateur a été modifié avec success').subscribe(result => {
              this.translateService.get('Opération terminée').subscribe(res => {
                this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
            this.accountSettings.hide()
          }
        })
        break;
      case "admin":
        this.rest.patch('/admins/current/', { user: this.rest.getDirtyValues(this.userForm) }).subscribe(res => {
          if (res.status === 200) {
            Object.assign(this.user, res.body.user)
            this.translateService.get('utilisateur a été modifié avec success').subscribe(result => {
              this.translateService.get('Opération terminée').subscribe(res => {
                this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
              })
            })
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
    localStorage.setItem("lang", this.sharedService.lang || "fr")
    this.router.navigate(["login"])
  }
  resetPassword(form) {
    this.submit = true
    if (this.resetPasswordForm.invalid) {
      return
    }
    this.rest.post('/auth/token/basic/', { email: this.user.email, password: form.oldPasword }).subscribe(res => {
      if (res?.status === 200) {
        switch (this.user.type) {
          case "agent":
            this.rest.patch('/agents/' + this.manager.id + "/", { user: { password: form.newPassword } }).subscribe(res => {
              console.log(res);
              if (res?.status === 200) {
                this.changePassword.hide()
                this.translateService.get('utilisateur a été modifié avec success').subscribe(result => {
                  this.translateService.get('Opération terminée').subscribe(res => {
                    this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                  })
                })
              }
            })
            break;
          case "manager":
            this.rest.patch('/managers/' + this.manager.id + "/", { user: { password: form.newPassword } }).subscribe(res => {
              console.log(res);
              if (res?.status === 200) {
                this.changePassword.hide()
                this.translateService.get('utilisateur a été modifié avec success').subscribe(result => {
                  this.translateService.get('Opération terminée').subscribe(res => {
                    this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                  })
                })
              }
            })
            break;
          case "admin":
            this.rest.patch('/admins/current/', { user: { password: form.newPassword } }).subscribe(res => {
              console.log(res);
              if (res?.status === 200) {
                this.changePassword.hide()
                this.translateService.get('utilisateur a été modifié avec success').subscribe(result => {
                  this.translateService.get('Opération terminée').subscribe(res => {
                    this.toastr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                  })
                })
              }
            })
            break;
        }
      }
    })

  }
}
