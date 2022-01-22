import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../services/rest.service";
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submit: boolean = false
  gretting: string
  constructor(private fb: FormBuilder, private rest: RestService, private router: Router,) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      password: new FormControl("", Validators.required),
    });
    let date = new Date()
    let time = date.getHours()
    console.log(time);
    
    if (time <= 11) {
      localStorage.getItem('lang')==="ar"? this.gretting ="صباح الخير ": this.gretting ="Bonjour"
    }
  else{     
      localStorage.getItem('lang')==="ar"? this.gretting ="مساء الخير ": this.gretting ="Bonsoir"

    }
  }
  get f() { return this.loginForm.controls }
  login(form) {
    this.submit = true
    if (this.loginForm.invalid) {
      return
    }
    this.rest.post('/auth/token/basic/' ,form).subscribe(res => {
      if (res?.status === 200) {
        localStorage.setItem('token', res.body.access)
        localStorage.setItem('refresh', res.body.refresh)
        localStorage.removeItem('lang')
        this.router.navigate(['dashboard'])
      }
    }
    )
  }
}
