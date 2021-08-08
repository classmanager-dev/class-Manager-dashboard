import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('manager', { static: false }) manager: ModalDirective;
  center: any
  centerForm: FormGroup;
  managerForm: FormGroup;
  managers: any = []
  submit: boolean = false
  constructor(private rest: RestService, private fb: FormBuilder) { }

  ngOnInit() {
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl(null, Validators.required),

    });
    this.managerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      type: new FormControl(null, Validators.required),

    });
    this.getcenter()
    this.getManagers(1)
    this.getAgents(1)
  }
  get f() { return this.managerForm.controls }
  getcenter() {
    this.rest.getCenter(localStorage.getItem('center')).subscribe(res => {
      this.center = res
    })
  }
  getManagers(page) {
    this.rest.getManagers(page).subscribe(res => {
      res.results.forEach(element => {
        this.managers.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getManagers(page)
      }
    })
  }
  getAgents(page) {
    this.rest.getAgents(page).subscribe(res => {
      res.results.forEach(element => {
        this.managers.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getManagers(page)
      }
    })
  }
  crudManager(form) {
    this.submit = true
    if (this.managerForm.invalid) {
      return
    }
   form.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
    console.log({user:form,center:this.center.id});  
    this.rest.addManager({user:form,center:this.center.id}).subscribe(res=>{
      this.managers.push(res)
    })
  }
}
