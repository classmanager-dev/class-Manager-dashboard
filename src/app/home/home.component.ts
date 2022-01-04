import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { ActivatedRoute, Router, } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { MustMatch } from '../_helpers/must-match.validator';
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';

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
  constructor(public toastr: ToastrService, private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document, private rest: RestService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) { }

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
        this.changeLangage('fr')
        break;
      case "manager":
        await this.rest.get('/managers/current/').toPromise().then(res => {
          if (res?.status === 200) {
            this.manager = res.body
            this.setupLang(res.body.center_verbose)
            this.selecctedCenter = res.body.center
            localStorage.setItem('center', res.body.center)
          }
        })
        break;
      case "agent":
        await this.rest.get('/agents/current/').toPromise().then(res => {
          if (res?.status===200) {
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
  setupLang(center) {
    let lang
      switch (center.language) {
        case "FR":
          lang = "fr"
          break;
        case "AR":
          lang = "ar"
          break;
      }
      this.changeLangage(lang)
    
  }
  changeLangage(lang: string) {
    localStorage.setItem("lang", lang)
    let htmlTag = this.document.getElementsByTagName(
      "html"
    )[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    this.changeCssFile(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName(
      "head"
    )[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById(
      "langCss"
    ) as HTMLLinkElement;

    let bundleName = lang === "ar" ? "/arabicStyle.css" : "/englishStyle.css";

    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      // newLink.type = "text/css";
      // newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
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
        this.rest.patch( '/managers/' + this.manager.id + "/",{ user: this.rest.getDirtyValues(this.userForm) }).subscribe(res => {
          if (res.status === 200) {
            console.log(res);

            Object.assign(this.user, res.body.user)
            this.accountSettings.hide()
          }
        })
        break;
      case "agent":
        this.rest.patch('/agents/' +  this.manager.id + "/",{ user: this.rest.getDirtyValues(this.userForm) }).subscribe(res => {
          if (res.status === 200) {
            Object.assign(this.user, res.body.user)
            this.accountSettings.hide()
          }
        })
        break;
      case "admin":
        this.rest.patch('/admins/current/',{ user: this.rest.getDirtyValues(this.userForm) }).subscribe(res => {
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
  resetPassword(form) {
    this.submit = true
    if (this.resetPasswordForm.invalid) {
      return
    }
    this.rest.post('/auth/token/basic/',{ email: this.user.email, password: form.oldPasword }).subscribe(res => {
      if (res.status === 200) {
        switch (this.user.type) {
          case "agent":
            this.rest.patch('/agents/' + this.manager.id + "/",{ user: { password: form.newPassword } }).subscribe(res => {
              console.log(res);
              if (res.status === 200) {
                this.changePassword.hide()
                this.toastr.success('l\'utilisateur a été modifié avec success', 'Opération terminée');

              }
            })
            break;
          case "manager":
            this.rest.patch('/managers/' + this.manager.id + "/",{ user: { password: form.newPassword } }).subscribe(res => {
              console.log(res);
              if (res.status === 200) {
                this.changePassword.hide()
                this.toastr.success('l\'utilisateur a été modifié avec success', 'Opération terminée');

              }
            })
            break;
          case "admin":
            this.rest.patch('/admins/current/',{ user: { password: form.newPassword } }).subscribe(res => {
              console.log(res);
              if (res.status === 200) {
                this.changePassword.hide()
                this.toastr.success('l\'utilisateur a été modifié avec success', 'Opération terminée');

              }
            })
            break;
        }
      }
    })

  }
}
