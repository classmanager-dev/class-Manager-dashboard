import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  contactForm: FormGroup;
  submit:boolean=false
  constructor(private translateService:TranslateService,private toastr:ToastrService,private rest:RestService,private fb: FormBuilder) { }
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      name: new FormControl("", [Validators.required,]),
      subject: new FormControl("", [Validators.required,]),
      body: new FormControl("", [Validators.required,]),
    });
  }
get f (){return this.contactForm.controls}
sendEmail(form){
  this.submit=true
  if (this.contactForm.invalid) {
    return
  }
  this.rest.post('/contact/us/',form).subscribe(res=>{
   if (res?.status===201) {
    this.translateService.get('Email a été envoyé avec succès').subscribe(result => {
      this.translateService.get('Nous avons réçu votre email, le service commercial vas vous contacter le plus tot possible').subscribe(res => {
        this.toastr.success(res, result, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
      })
    })
   }
    
  })
  console.log(form);
  
}
}
