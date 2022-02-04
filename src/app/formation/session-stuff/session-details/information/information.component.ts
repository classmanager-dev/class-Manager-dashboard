import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { CourseCRUDComponent } from "../../course-crud/course-crud.component";
import { ConfirmationModalComponent } from "../../../../confirmation-modal/confirmation-modal.component";
import { RestService } from "../../../../services/rest.service";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
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
  constructor(private translateService: TranslateService, private tostr: ToastrService, public sdetails: SessionDetailsComponent, private rest: RestService, private router: Router) { }
  ngOnInit(): void {
    this.course = this.sdetails.course
    this.lang = this.translateService.currentLang
    this.course.schedules_verbose.forEach(element => {
      this.rest.justifyText(element)
    });
  }

  onConfirm(event) {
    this.rest.delete('/courses/' + this.course.id + "/").subscribe(res => {
      if (res?.status === 204) {
        this.translateService.get('la suppression a été effectuée avec success').subscribe(result => {
          this.translateService.get('Opération terminée').subscribe(res => {
            this.tostr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
          })
        })
        this.router.navigate(['/formation/stuff/' + this.course.session])
      }
      
    })

  }
  showModal() {
    this.addFormationModal.addFormationModal.show()
  }
}
