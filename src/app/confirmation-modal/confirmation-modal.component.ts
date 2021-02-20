import { Component, OnInit,ViewChild ,Output,EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('deleteModal', { static: false }) deleteModal: ModalDirective;
  @Output() onConfirm = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
confirm(){
  this.onConfirm.emit(true);
}

}
