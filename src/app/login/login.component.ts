import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../services/rest.service";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private toast:ToastrService,private fb: FormBuilder, private rest: RestService, private router: Router,) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
      password: new FormControl("", Validators.required),
    });
  }
  get f() { return this.loginForm.controls }
  login(form) {
    if (this.loginForm.invalid) {
      return
    }
    this.rest.login(form).subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.access)
      localStorage.setItem('refresh', res.refresh)
      this.router.navigate(['dashboard'])
    },err=>{
      console.log(err);
      
      this.toast.error('Veuillez essayer encore une fois','Une erreur a été produite ')
    }
      )
  }
}
