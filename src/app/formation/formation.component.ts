import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { RestService } from "../services/rest.service";
import { DatePipe } from '@angular/common';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {
  modalRef: BsModalRef;
  sessions: any = []
  bsConfig: Partial<BsDatepickerConfig>;
  sessionForm: FormGroup;
  submit: boolean = false
  center: any
  centers: any = [] = []
  currentPage: any;
  page: number = 1
  constructor(private router: Router, private datePipe: DatePipe, private localeService: BsLocaleService, private modalService: BsModalService, public rest: RestService, private fb: FormBuilder, public route: ActivatedRoute) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }

  ngOnInit() {
    this.getSessions(1)
    this.sessionForm = this.fb.group({
      name: new FormControl("", Validators.required),
      starting_date: new FormControl("", Validators.required),
      finishing_date: new FormControl("", Validators.required),
      center: new FormControl(null, Validators.required),
    });
    this.center = this.rest.getQueryParams()
    if (this.center) {
      this.sessionForm.get('center').setValue(this.center)
    } else {
      this.getCenters(1)
    }

  }
  getCenters(page) {
    this.rest.getCentres(page).subscribe(res => {
      res.results.forEach(element => {
        this.centers.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getCenters(page)
      }
    })
  }
  get f() { return this.sessionForm.controls }
  getSessions(page) {
    this.rest.getSessions(page).subscribe(res => {
      this.sessions = res
      res.results.forEach(element => {
        this.rest.getCoursesBySession(element.id, 1).subscribe(result => {
          element.coursesNumber = result.results.length
        })
      });
      console.log(res);

    })
  }
  addSession(form) {
    if (this.sessionForm.invalid) {
      this.submit = true
      return
    }
    form.finishing_date = this.datePipe.transform(new Date(form.finishing_date), 'yyyy-MM-dd')
    form.starting_date = this.datePipe.transform(new Date(form.starting_date), 'yyyy-MM-dd')

    this.rest.addSession(form).subscribe(res => {
      console.log(res);
      this.modalRef.hide()
      this.sessions.results.unshift(res)
    })
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/students'], { queryParams: { page: this.page } });

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
