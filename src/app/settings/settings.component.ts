import { Component, OnInit,ViewChild } from '@angular/core';
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
  center:any
  centerForm: FormGroup;

  constructor(private rest:RestService,private fb: FormBuilder) { }

  ngOnInit() {
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl(null, Validators.required),
     
    });
  }

}
