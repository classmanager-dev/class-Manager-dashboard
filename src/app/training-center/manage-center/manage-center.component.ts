import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
  towns: any[] = []
  @ViewChild('TraingCentre', { static: false }) TraingCentre: ModalDirective;
  @Input() center: any
  constructor(private toastr:ToastrService,private fb: FormBuilder, private rest: RestService,private router:Router) { }

  ngOnInit(): void {
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      town: new FormControl(null, Validators.required),
      is_active:true
    });
    this.getTowns(1)
    if (this.center) {
      this.centerForm.patchValue({
        name: this.center.name,
        phone: this.center.phone,
        address: this.center.address,
        town: this.center.town,
      })
      this.imgUrl = this.center.logo

    }
  }
  get f() { return this.centerForm.controls; }
  getTowns(page) {
    this.rest.getTowns(page).subscribe(res => {
      res.results.forEach(element => {
        this.towns.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getTowns(page)
      }
    })
  }
  showPreviewImage(event: any,) {
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
       if (res.status===200) {
        this.center.logo = res.body.logo
       }

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
      if (res.status===200) {
        this.toastr.success( 'Le centre  a été modifié avec success','Opération terminée');        
        Object.assign(this.center, res.body)
        this.rest.getTown(res.body.town).subscribe(res=>{
          this.center.town_verbose=res
        })
        this.managePictures(res.body.id)
      }
      })
    } else {
      this.rest.addCentres(form).subscribe(res => {
       if (res.status===201) {
        this.managePictures(res.body.id)
        this.TraingCentre.hide()
        this.router.navigate(['traingCentres/details/'+res.body.id])
       }
      })
    }
    this.TraingCentre.hide()
  }
}
