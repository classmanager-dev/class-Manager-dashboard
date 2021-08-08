import { Component, OnInit ,Input,ViewChild} from '@angular/core';
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

  course:any
  constructor(public sdetails:SessionDetailsComponent,private rest:RestService,private location:Location) { }
  ngOnInit(): void {
    this.course=this.sdetails.course
    console.log(this.course);
    
  }
  onConfirm(event) {
    
    this.rest.deleteCourse(this.course.id).subscribe(res => {
      console.log(res);
      this.location.back()

    })
  }
  showModal(){
    this.addFormationModal.addFormationModal.show()
    document.querySelector("label[for='selectBase']").classList.add('d-none')
    document.querySelector("option[value='0']").textContent="Selectionner"
    document.querySelector("option[value='3']").textContent="Jour"
    document.querySelector("option[value='4']").textContent="Semaine"
    document.querySelector("option[value='5']").textContent="Mois"
  }
}
