import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from "../../services/rest.service";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import jwt_decode from "jwt-decode";
import { SharedService } from 'src/app/services/shared.service';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-training-centre-details',
  templateUrl: './training-centre-details.component.html',
  styleUrls: ['./training-centre-details.component.css']
})
export class TrainingCentreDetailsComponent implements OnInit {
  activateRoute: string
  center: any
  selecctedCenter: any
  lang: any
  decodedToken
  centerForm: FormGroup;
  submit: boolean
  @ViewChild('editCenterModal', { static: false }) editCenterModal?: ModalDirective;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(private fb: FormBuilder, private localeService: BsLocaleService, private shared: SharedService, private translateService: TranslateService, private rest: RestService, private route: ActivatedRoute) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }
  ngOnInit(): void {
    this.centerForm = this.fb.group({
      subscription_expiration: new FormControl("", Validators.required),
      status: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      is_active: new FormControl(null, Validators.required),
    });
      switch (this.route.snapshot.firstChild.routeConfig.path) {
        case "information":
          this.activateRoute = "information"
          break;
        case "subscriptions":
          this.activateRoute = "subscriptions"
          break;
        case "centre-state":
          this.activateRoute = "centre-state"
          break;
        case "modification":
          this.activateRoute = "modification"
          break;
      }
    this.lang = this.translateService.currentLang
    if (localStorage.getItem('center')) {
      this.selecctedCenter = localStorage.getItem('center')
    }
    this.decodedToken = jwt_decode(localStorage.getItem('token'))
    this.rest.get('/centers/' + this.route.snapshot.params['id'] + "/").subscribe(res => {
      if (res?.status === 200) {
        this.center = res.body
        if (res.body.town) {
          this.rest.get('/towns/' + res.body.town).subscribe(result => {
            if (result.status === 200) {
              this.center.town_verbose = result.body
            }
          })
        }
      }
    })
  }
  get f() { return this.centerForm.controls }
  changeRoute(route) {
    this.activateRoute = route
  }
  editCenter(form) {
    this.submit=true
    if (this.centerForm.invalid) {
      return
    }
    let date = new Date(form.subscription_expiration)
    this.centerForm.patchValue({ subscription_expiration: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() })
    this.rest.patch('/centers/' + this.center.id + '/', this.rest.getDirtyValues(this.centerForm)).subscribe(res => {
      if (res?.status === 200) {
        console.log(res);
        Object.assign(this.center, res.body)
        this.center.restDays = this.shared.manageDate(this.center.subscription_expiration)
        this.editCenterModal.hide()
      }

    })

  }
  openModal() {  
    this.editCenterModal.show()
    this.centerForm.patchValue({
      subscription_expiration: new Date(this.center.subscription_expiration),
      status: this.center.status,
      type: this.center.type,
      is_active: this.center.is_active
    })   
  }
}
