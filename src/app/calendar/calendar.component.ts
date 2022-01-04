import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid';
import { RestService } from '../services/rest.service';
import frLocale from '@fullcalendar/core/locales/fr';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  courses: any[] = []
  coursesEvents: any[] = []
  calendarOptions: CalendarOptions
  constructor(private rest: RestService, private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.getCourses(1)
  }
  getCourses(page) {
    this.rest.get('/centers/' + localStorage.getItem('center') + "/courses/?page=" + page).subscribe(res => {
     if (res?.status===200) {
      res.body.results.forEach(element => {
        let events: any[] = []
        this.courses.push(element)
        element.startRecur = this.datePipe.transform(new Date(element.starting_date), 'yyyy-MM-dd')
        element.endRecur = this.datePipe.transform(new Date(element.finishing_date), 'yyyy-MM-dd')
        element.schedules_verbose.forEach(schedule => {
          let daysOfWeek: any[] = []
          switch (schedule.repeat) {
            case "* * * * SUN":
              daysOfWeek.push(0)
              break;
            case "* * * * MON":
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
            case "* * * * SAT":
              daysOfWeek.push(6)
              break;
          }
          let color =this.colors()
          schedule.startTime = schedule.start_at
          schedule.endTime = schedule.finish_at
          this.coursesEvents.push({
            title: element.name,
            startTime: schedule.startTime,
            daysOfWeek: daysOfWeek,
            endTime: schedule.endTime,
            startRecur: element.startRecur,
            endRecur: element.endRecur,
            backgroundColor: color,
            borderColor:color
          })
          element.events = events
        });

      });
      if (res.body.total_pages > page) {
        page++
        this.getCourses(page)
      }
     }
    })
    this.calendarOptions = {
      plugins: [timeGridPlugin],
      locales: [frLocale],
      timeZone: 'UTC',
      initialView: 'dayGridMonth',
      allDaySlot: false,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      locale: "fr",
      firstDay: 6,
      slotMinTime: "07:00:00",
      events: this.coursesEvents,
      handleWindowResize: true
      
    };
   this.colors()

  }
  colors(){    
    var colors = [ '#89A8CF', '#3762F6',"#0049C9","#2DD576","#DF0429",]; 
    var rand = colors[(Math.random() * colors.length) | 0]    
    return rand
  }
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }
}
