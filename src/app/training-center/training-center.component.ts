import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { RestService } from "../services/rest.service";
import { HomeComponent } from "../home/home.component";
@Component({
  selector: 'app-training-center',
  templateUrl: './training-center.component.html',
  styleUrls: ['./training-center.component.css']
})
export class TrainingCenterComponent implements OnInit {
  @ViewChild('addTraingCentre', { static: false }) addTraingCentre: ModalDirective;
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string
  submit: boolean = false
  centerForm: FormGroup;
centers:any
  constructor(private fb: FormBuilder,public rest:RestService,private home:HomeComponent ) { }

  ngOnInit() {
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
    });
    this.centers=this.home.centres
  }
  get f() { return this.centerForm.controls; }

  showPreviewImage(event: any, ) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.selectedFile = <File>event.target.files[0];
      this.fileName = this.selectedFile.name
    }
  }
  addCenter(form) {
    this.submit = true
    if (this.centerForm.invalid) {
      return
    }
    this.rest.addCentres(form).subscribe(res=>{
      console.log(res);
      
    })
    console.log(form);

  }
}
