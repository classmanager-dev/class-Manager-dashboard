import { Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.component.html',
  styleUrls: ['./student-modal.component.css']
})
export class StudentModalComponent implements OnInit {
  @ViewChild('studentModal', { static: false }) studentModal: ModalDirective;

  constructor() { }

  ngOnInit(): void {
    // this.studentModal.show();
  }
  show(){
    this.studentModal.show();
  }
  hide(){
    this.studentModal.hide();
  }
}
