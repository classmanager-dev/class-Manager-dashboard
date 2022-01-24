import { Component, OnInit,ViewChild } from '@angular/core';
import { TrainingCentreDetailsComponent } from "../training-centre-details.component";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker'; 
import { RestService } from 'src/app/services/rest.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  @ViewChild('editCenterModal', { static: false }) editCenterModal?: ModalDirective;
  centerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  center: any
  constructor(private shared:SharedService,private rest:RestService,private centerDeatils:TrainingCentreDetailsComponent,private fb: FormBuilder,private localeService: BsLocaleService) { 
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }

  ngOnInit(): void {
    console.log(this.centerDeatils.center);
    this.centerForm = this.fb.group({
      subscription_expiration: new FormControl("", Validators.required),
    });
    
  }
  modifyCenter(form){
    if (this.centerForm.invalid) {
      return
    }
    let date = new Date(form.subscription_expiration)
    this.centerForm.patchValue({ subscription_expiration: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() })
   
    this.rest.patch('/centers/' + this.center.id + '/',this.rest.getDirtyValues(this.centerForm)).subscribe(res => {
      if (res.status === 200) {
        console.log(res);
        Object.assign(this.center, res.body)
        this.center.restDays=this.shared.manageDate(this.center.subscription_expiration)
        this.editCenterModal.hide()
      }

    })
    
}
openModal(center) {
  this.editCenterModal.show()
  this.center = center
  console.log(center);
  console.log(new Date(center.subscription_expiration));
}
}
