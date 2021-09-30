import { Component, OnInit } from '@angular/core';
import markerSDK from '@marker.io/browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor() {}

  title = 'classManager';
  ngOnInit() {
    const widget =  markerSDK.loadWidget({
      destination: '6155fbe4e4bd4d75f5ae1ede',
    });
  }
}
