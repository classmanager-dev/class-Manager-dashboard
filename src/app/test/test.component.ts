import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  courses: any[] = []
  coursesEvents: any[] = []
  array:any=[1,2,3,4]
  calendarOptions: CalendarOptions 
  constructor(private rest: RestService, private datePipe: DatePipe) {

  }

  ngOnInit() {
   
  }
 
}
