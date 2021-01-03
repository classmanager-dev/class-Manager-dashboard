import { Component, OnInit,ViewChild  } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-session-stuff',
  templateUrl: './session-stuff.component.html',
  styleUrls: ['./session-stuff.component.css']
})
export class SessionStuffComponent implements OnInit {
  @ViewChild('deleteSessionModal', { static: false }) deleteSessionModal: ModalDirective;
  @ViewChild('addFormationModal', { static: false }) addFormationModal: ModalDirective;

  constructor() { }

  ngOnInit(): void {
  }
  showdeleteSessionModal(): void {
    this.deleteSessionModal.show();
  }
}
