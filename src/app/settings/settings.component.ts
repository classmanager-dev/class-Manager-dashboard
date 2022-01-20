import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { ToastrService } from 'ngx-toastr';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('manager', { static: false }) manager: ModalDirective;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  center: any
  centerForm: FormGroup;
  managerForm: FormGroup;
  managers: any = []
  submit: boolean = false
  user: any = {}
  edit: boolean = false
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string = "File name"
  decoded_token: any
  constructor(private toastr: ToastrService, private rest: RestService, private fb: FormBuilder) { }

  ngOnInit() {
    this.decoded_token = jwt_decode(localStorage.getItem('token'));
    this.centerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      language: new FormControl(null, Validators.required),
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    });
    this.managerForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl("", Validators.required),
      type: new FormControl(null, Validators.required),

    });
    this.getcenter()
    this.getManagers(1)
    this.getAgents(1)
  }
  get f() { return this.managerForm.controls }
  getcenter() {
    this.rest.get( '/centers/' +  localStorage.getItem('center') + "/").subscribe(res => {
     if (res?.status===200) {
      this.center = res.body
      this.centerForm.patchValue({
        name: res.body.name,
        phone: res.body.phone,
        address: res.body.address,
        email: res.body.email,
        language: res.body.language,
      })
      this.imgUrl = res.body.logo
     }
    })
  }
  getManagers(page) {
    if ( localStorage.getItem("center")) {
      this.rest.get('/centers/' + localStorage.getItem("center") + '/managers/?page=' + page).subscribe(res => {
        res.body.results.forEach(element => {
          this.managers.push(element)
        });
        if (res.body.total_pages > page) {
          page++
          this.getManagers(page)
        }
      })
    } 
  }
  getAgents(page) {
    this.rest.get('/centers/' + localStorage.getItem("center") + '/agents/?page=' + page).subscribe(res => {
     if (res?.status===200) {
      res.body.results.forEach(element => {
        this.managers.push(element)
      });
      if (res.body.total_pages > page) {
        page++
        this.getManagers(page)
      }
     }
    })
  }
  crudManager(form) {
    this.submit = true
    if (this.edit) {
      this.managerForm.removeControl('password')
    }
    if (this.managerForm.invalid) {
      return
    }
    if (this.edit) {

      // switch (form.type) {
      //   case "manager":
      //     this.rest.patch('/managers/'+ this.user.id + "/",{ user: this.rest.getDirtyValues(this.managerForm) }).subscribe(res => {
      //       if (res.status === 200) {
      //         console.log(res);
      //         this.manager.hide()
      //         Object.assign(this.user, res.body)
      //         this.toastr.success('L\'utilisateur a été modifié avec succes', 'Opération terminée');
      //       }
      //     })
      //     break;
      //   case "agent":
      //     this.rest.patch('/agents/' +  this.user.id + "/",{ user: this.rest.getDirtyValues(this.managerForm) }).subscribe(res => {
      //       if (res?.status === 200) {
      //         Object.assign(this.user, res.body)
      //         this.manager.hide()
      //         this.toastr.success('L\'utilisateur a été modifié avec success', 'Opération terminée');
      //       }
      //     })
      //     break;
      // }

      console.log(this.rest.getDirtyValues(this.managerForm));
      
    }
    else {
      form.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
      switch (form.type) {
        case "manager":
          this.rest.post('/managers/',{ user: form, center: this.center.id }).subscribe(res => {
            if (res.status === 201) {
              this.managers.push(res.body)
              this.manager.hide()
            }

          })
          break;
        case "agent":
          this.rest.post('/agents/',{ user: form, center: this.center.id }).subscribe(res => {
            if (res.status === 201) {
              this.managers.push(res.body)
              this.manager.hide()
            }

          })
          break;
      }
    }
  }
  openMOdal(manager) {
    this.managerForm.patchValue({
      name: manager.user.name,
      family_name: manager.user.family_name,
      email: manager.user.email,
      type: manager.user.type,
    })
    this.user = manager
    this.edit = true
    this.manager.show()
  }
  openManagerModal() {
    this.manager.show();
    this.edit = false;
    this.managerForm.reset()
    this.managerForm.addControl('password', new FormControl("", Validators.required))
  }
  onConfirm(event) {
    switch (this.user.user.type) {
      case "manager":
        this.rest.delete('/managers/' + this.user.id + "/").subscribe(res => {
          if (res.status === 204) {
            for (let index = 0; index < this.managers.length; index++) {
              if (this.managers[index].id === this.user.id) {
                this.managers.splice(index, 1)
                this.deleteModal.deleteModal.hide()
              }
            }
            this.deleteModal.deleteModal.hide()
            this.manager.hide()
          }
        })
        break;
      case "agent":
        this.rest.delete('/agents/' + this.user.id + "/").subscribe(res => {
          if (res.status === 204) {
            for (let index = 0; index < this.managers.length; index++) {
              if (this.managers[index].id === this.user.id) {
                this.managers.splice(index, 1)
                this.deleteModal.deleteModal.hide()
              }
            }
          }
          this.deleteModal.deleteModal.hide()
          this.manager.hide()

        })
        break;
    }
  }
  editCenter() {
    console.log(this.rest.getDirtyValues(this.centerForm));

    this.rest.patch( '/centers/' + localStorage.getItem('center') + '/',this.rest.getDirtyValues(this.centerForm)).subscribe(res => {
      if (res.status === 2000) {
        console.log(res);

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
      this.fileName = this.selectedFile.name.substring(0, 10)
      const fd = new FormData();
      fd.append('logo', this.selectedFile);
      this.rest.patch( '/centers/' + localStorage.getItem('center') + '/logo/',fd).subscribe(res => {
        if (res.status === 200) {
          this.toastr.success('L\'image a été téléchargé avec succes', 'Opération terminée');

        }
        console.log(res);

      })
    }
  }
}