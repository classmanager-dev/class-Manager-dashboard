import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { CourseCRUDComponent } from "../../course-crud/course-crud.component";
import { ConfirmationModalComponent } from "../../../../confirmation-modal/confirmation-modal.component";
import { RestService } from "../../../../services/rest.service";
import { Location } from '@angular/common';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Input() showDiv: boolean;
  @ViewChild('addFormationModal') addFormationModal: CourseCRUDComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;

  course: any
  constructor(public sdetails: SessionDetailsComponent, private rest: RestService, private location: Location) { }
  ngOnInit(): void {
    this.course = this.sdetails.course
    var cronstrue = require('cronstrue/i18n');
    this.course.schedules_verbose.forEach(element => {
      var repeat = cronstrue.toString(element.repeat, { locale: "fr" })
      element.repeated = repeat.split(', uniquement le')[1] 
      element.start_at = element.start_at.match(/([^:]+:){2}/)[0].slice(0, -1)
      element.finish_at = element.finish_at.match(/([^:]+:){2}/)[0].slice(0, -1)
      console.log(element);

    });
   

  }
  onConfirm(event) {

    this.rest.deleteCourse(this.course.id).subscribe(res => {
      console.log(res);
      this.location.back()

    })
  }
  showModal() {
    this.addFormationModal.addFormationModal.show()
  }
}
