import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../services/rest.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-trial-account',
  templateUrl: './trial-account.component.html',
  styleUrls: ['./trial-account.component.css']
})
export class TrialAccountComponent implements OnInit {
  centerForm: FormGroup;
  managerForm: FormGroup;
  submit: boolean = false
  constructor(private fb: FormBuilder, private rest: RestService,private router:Router) { }

  ngOnInit(): void {
    this.centerForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      is_active: new FormControl(true, Validators.required),

    });
    this.managerForm = this.fb.group({
      family_name: new FormControl("", [Validators.required,]),
      name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      password: new FormControl("", Validators.required),
    });
  }
  get f() { return this.centerForm.controls }
  get g() { return this.managerForm.controls }
  createTrialAccount(centerForm, managerForm) {
    this.submit = true
    if (this.centerForm.invalid || this.managerForm.invalid) {
      return
    }
    this.rest.post( '/centers/',centerForm).subscribe(res => {
      if (res?.status===201) {
        localStorage.setItem("center",res.body.id)
        managerForm.username=(managerForm.name + managerForm.family_name).replace(/\s/g, "_").toLowerCase()
        this.rest.post('/managers/',{user:managerForm,center:res.body.id}).subscribe(result=>{
          console.log(result);
          if (result.status===201) {
            this.router.navigate(['students'])
          }
        })
        
      }
    })

  }
}
