import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css']
})
export class PresenceComponent implements OnInit {
@Input() showDiv
  constructor() { }

  ngOnInit(): void {
  }

}
