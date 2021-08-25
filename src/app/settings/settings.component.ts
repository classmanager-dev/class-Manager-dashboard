import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RestService } from "../services/rest.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
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
  user:any={}
  edit:boolean=false
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
      email: new FormControl("", [Validators.required,Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]),
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
    if (this.edit) {
       this.managerForm.removeControl('password')
    }
    if (this.managerForm.invalid) {
      return
    }
    if (this.edit) {
      switch (form.type) {
        case "manager":
         this.rest.editManager({user:this.rest.getDirtyValues(this.managerForm)},this.user.id).subscribe(res=>{
          if (res.status===200) {
            console.log(res);
            this.manager.hide()
             Object.assign(this.user,res.body)
          }
         })
          break;
          case "agent":
           this.rest.editAgent({user:this.rest.getDirtyValues(this.managerForm)},this.user.id).subscribe(res=>{
            if (res.status===200) {
               Object.assign(this.user,res.body)
            this.manager.hide()
               
            }
           })
            break;
      }
    }
else{
  form.username = (form.name + form.family_name).replace(/\s/g, "_").toLowerCase()
    switch (form.type) {
      case "manager":
        this.rest.addManager({ user: form, center: this.center.id }).subscribe(res => {
          if (res.status===201) {
            this.managers.push(res)
          console.log(res);
          }
          
        })
        break;
      case "agent":
        this.rest.addAgent({ user: form, center: this.center.id }).subscribe(res => {
         if (res.status===201) {
          this.managers.push(res)
          console.log(res);
         }
          
        })
        break;
    }
}
  }
  openMOdal(manager){    
    this.managerForm.patchValue({
      name: manager.user.name,
      family_name: manager.user.family_name,
      email: manager.user.email,
      type: manager.user.type,
    })
    this.user=manager
    this.edit=true
    this.manager.show()
  }
  openManagerModal(){
    this.manager.show();
    this.edit=false;
    this.managerForm.reset()
    this.managerForm.addControl('password',new FormControl("",Validators.required))
  }
  onConfirm(event) {
    console.log(this.user);
    
   switch (this.user.user.type) {
     case "manager":
       this.rest.deleteManager(this.user.id).subscribe(res=>{
         if (res.status===204) {
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
        this.rest.deleteAgent(this.user.id).subscribe(res=>{
          if (res.status===204) {
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
}