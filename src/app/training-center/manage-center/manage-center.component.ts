import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../../services/rest.service";
@Component({
  selector: 'app-manage-center',
  templateUrl: './manage-center.component.html',
  styleUrls: ['./manage-center.component.css']
})
export class ManageCenterComponent implements OnInit {
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string
  submit: boolean = false
  centerForm: FormGroup;

  @ViewChild('TraingCentre', { static: false }) TraingCentre: ModalDirective;
  @Input() center: any
  constructor(private fb: FormBuilder, private rest: RestService, ) { }

  ngOnInit(): void {
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
    });
    if (this.center) {
      this.centerForm.patchValue({
        name: this.center.name,
        phone: this.center.phone,
        address: this.center.address,
      })
      this.imgUrl = this.center.logo

    }
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
  managePictures(id) {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('logo', this.selectedFile);
      this.rest.addPicturesCentre(fd, id).subscribe(res => {
        this.center.logo = res.logo

      })
    }
  }
  manageCenter(form) {
    this.submit = true
    if (this.centerForm.invalid) {
      return
    }
    if (this.center) {
      this.rest.editCentres(form, this.center.id).subscribe(res => {
        Object.assign(this.center, res)
        this.managePictures(res.id)
      })
    } else {
      this.rest.addCentres(form).subscribe(res => {
        this.managePictures(res.id)
        this.TraingCentre.hide()
        // this.centers.unshift(res)
      })
    }
    this.TraingCentre.hide()
  }
}
