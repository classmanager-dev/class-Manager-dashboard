import { Component, OnInit ,Input,ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { BsLocaleService,BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-manage-professors',
  templateUrl: './manage-professors.component.html',
  styleUrls: ['./manage-professors.component.css']
})
export class ManageProfessorsComponent implements OnInit {
  @ViewChild('professorModal', { static: false }) professorModal: ModalDirective;

  professorForm: FormGroup;
  imgUrl: any[];
  selectedFile: File = null;
  fileName: string="File name"
  bsConfig: Partial<BsDatepickerConfig>;
  locales = listLocales();
@Input ()professor
  constructor(private fb: FormBuilder,private localeService: BsLocaleService) { 
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");

  }

  ngOnInit(): void {
    this.professorForm = this.fb.group({
      name: new FormControl("", Validators.required),
      family_name: new FormControl("", Validators.required),
      gender: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      birthday: new FormControl(new Date(), Validators.required),
    });
  }
  get f() { return this.professorForm.controls; }
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
  manageProfessor(form){
    console.log(form);
    
  }
}
