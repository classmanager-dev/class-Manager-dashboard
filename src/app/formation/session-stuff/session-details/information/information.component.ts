import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { CourseCRUDComponent } from "../../course-crud/course-crud.component";
import { ConfirmationModalComponent } from "../../../../confirmation-modal/confirmation-modal.component";
import { RestService } from "../../../../services/rest.service";
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Input() showDiv: boolean;
  @ViewChild('addFormationModal') addFormationModal: CourseCRUDComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  cronstrue: any
  course: any
  lang
  constructor(private translateService: TranslateService, private tostr: ToastrService, public sdetails: SessionDetailsComponent, private rest: RestService, private location: Location) { }
  ngOnInit(): void {
    this.course = this.sdetails.course
    this.lang = this.translateService.currentLang
    this.course.schedules_verbose.forEach(element => {
      this.rest.justifyText(element)
    });
  }

  onConfirm(event) {
    this.rest.patch('/courses/' + this.course.id + "/", { is_active: false }).subscribe(res => {
      if (res.status === 200) {
        this.translateService.get('la suppression a été effectuée avec success').subscribe(result => {
          this.translateService.get('Opération terminée').subscribe(res => {
            this.tostr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
          })
        })
      }
      this.location.back()
    })

  }
  showModal() {
    this.addFormationModal.addFormationModal.show()
  }
}
