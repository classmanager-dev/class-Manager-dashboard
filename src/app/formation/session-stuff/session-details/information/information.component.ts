import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { CourseCRUDComponent } from "../../course-crud/course-crud.component";
import { ConfirmationModalComponent } from "../../../../confirmation-modal/confirmation-modal.component";
import { RestService } from "../../../../services/rest.service";
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
declare var require: any

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  @Input() showDiv: boolean;
  @ViewChild('addFormationModal') addFormationModal: CourseCRUDComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  cronstrue:any
  course: any
  constructor(private tostr: ToastrService, public sdetails: SessionDetailsComponent, private rest: RestService, private location: Location) { }
  ngOnInit(): void {
    this.course = this.sdetails.course
    try {
      this.cronstrue = require('cronstrue/i18n');
      this.course.schedules_verbose.forEach(element => {
        this.justifyText(element)
      });

    } catch (error) {
      console.log(error);

    }

  }
  justifyText(element){
    var repeat = this.cronstrue.toString(element.repeat, { locale: "fr" })
        element.repeated = repeat.split(', uniquement le')[1]
        var start_at = element.start_at.split(':');
        var finish_at = element.finish_at.split(':');
        start_at.pop();
        finish_at.pop();
        var start_at_result = start_at.join(':');
        var finish_at_result = finish_at.join(':');
        element.start_at = start_at_result
        element.finish_at = finish_at_result
  }
  onConfirm(event) {
    this.rest.editCourse({is_active:false},this.course.id).subscribe(res=>{
        if (res.status === 200) {
          this.tostr.success("la suppression a été effectuée avec success", "Opération terminé")
        }
        this.location.back()
    })
  
  }
  showModal() {
    this.addFormationModal.addFormationModal.show()
  }
}
