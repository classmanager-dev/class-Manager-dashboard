import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from 'src/app/home/home.component';
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
  regions: any[] = []
  towns: any[] = []
  region:any=null
  lang=localStorage.getItem('lang')
  @ViewChild('TraingCentre', { static: false }) TraingCentre: ModalDirective;
  @Input() center: any
  constructor(private app:HomeComponent,private toastr:ToastrService,private fb: FormBuilder, private rest: RestService,private router:Router) { }

  ngOnInit(): void {
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      town: new FormControl(null, Validators.required),
      language: new FormControl(null, Validators.required),
      is_active:true
    });
    this.getRegions(1)
    if (this.center) {
     if (this.center.town) {
      this.rest.get('/towns/' +this.center.town).subscribe(res=>{
       if (res?.status===200) {
        this.region=res.body.region
        this.rest.get('/towns?region='+this.region).subscribe(res=>{
         res.body.results.forEach(element => {
           this.towns.push(element)
         });         
        })
       }
       })
     }
      this.centerForm.patchValue({
        name: this.center.name,
        phone: this.center.phone,
        address: this.center.address,
        town: this.center.town,
        email: this.center.email,
        language: this.center.language,
      })
      this.imgUrl = this.center.logo

    }
  }
  get f() { return this.centerForm.controls; }
  getRegions(page) {
    this.rest.get('/regions/?page='+page).subscribe(res => {
      if (res?.status===200) {
       res.body.results.forEach(element => {
         this.regions.push(element)
       });
       if (res.body.total_pages > page) {
         page++
         this.getRegions(page)
       }
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
      this.rest.patch( '/centers/' + id + '/logo/',fd).subscribe(res => {
       if (res.status===200) {
        this.center.logo = res.body.logo
       }

      })
    }
  }
  selectRegion(){
    this.towns.length=0
    this.centerForm.patchValue({
      town:null
    })
    this.rest.get('/towns?region='+this.region).subscribe(res=>{
      if (res.status===200) {
        console.log(res);
      res.body.results.forEach(element => {
        this.towns.push((element))
      });
      }
    })
  }
  manageCenter(form) {
    this.submit = true
    if (this.centerForm.invalid) {      
      return
    }
    if (this.center) {
      this.rest.patch('/centers/' + this.center.id + '/',this.rest.getDirtyValues(this.centerForm)).subscribe(res => {
      if (res.status===200) {
        this.toastr.success( 'Le centre  a été modifié avec success','Opération terminée');        
        Object.assign(this.center, res.body)
        this.rest.get('/towns/' +res.body.town).subscribe(res=>{
         if (res?.status===200) {
          this.center.town_verbose=res.body
         }
        })
        this.managePictures(res.body.id)
        switch (res.body.language) {
          case "FR":
            this.app.changeLangage("fr")
            break;
            case "AR":
              this.app.changeLangage("ar")
              break;
        }
       
      }
      })
    } else {
      this.rest.post( '/centers/',form).subscribe(res => {
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
