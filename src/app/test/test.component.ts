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
    this.getCourses(1)
    var colors = ['January', 'February', 'March']; 
    var rand = colors[(Math.random() * colors.length) | 0]
    console.log(rand)
    
  }
  getCourses(page) {
    this.rest.getCoursesByCenter(63, page).subscribe(res => {
      res.results.forEach(element => {
        let events: any[] = []
        this.courses.push(element)
        element.startRecur = this.datePipe.transform(new Date(element.starting_date), 'yyyy-MM-dd')
        element.endRecur = this.datePipe.transform(new Date(element.finishing_date), 'yyyy-MM-dd')
        element.schedules_verbose.forEach(schedule => {
         let daysOfWeek:any[]=[]
          switch (schedule.repeat) {
            case "* * * * SUN":
              daysOfWeek.push(0) 
              break;
            case "* * * * MON" :
              daysOfWeek.push(1) 
              break;
            case "* * * * TUE":
              daysOfWeek.push(2) 
              break;
            case "* * * * WED":
              daysOfWeek.push(3) 
              break;
            case "* * * * THU":
              daysOfWeek.push(4) 
              break;
            case "* * * * FRI":
              daysOfWeek.push(5) 
              break;
            case  "* * * * SAT":
              daysOfWeek.push(6) 
              break;
          }
          schedule.startTime = schedule.start_at
          schedule.endTime = schedule.finish_at
          this.coursesEvents.push({ 
            title:element.name,
            startTime: schedule.startTime, 
            daysOfWeek: daysOfWeek, 
            endTime: schedule.endTime, 
            startRecur: element.startRecur, 
            endRecur: element.endRecur },)
          element.events = events
        });

      });
      if (res.total_pages > page) {
        page++
        this.getCourses(page)
      }
    })
    this.calendarOptions={
      plugins: [timeGridPlugin],
  
      timeZone: 'UTC',
      initialView: 'timeGridWeek',
      allDaySlot: false,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      locale: "fr",
      firstDay: 6,
      slotMinTime: "07:00:00",
      events: this.coursesEvents
  
     
  
  
    };
    console.log(this.coursesEvents);

  }
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }
}
