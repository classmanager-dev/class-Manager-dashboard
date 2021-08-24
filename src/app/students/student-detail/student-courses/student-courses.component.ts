import { Component, OnInit,ViewChild } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { MemebershipModalComponent } from '../../memebership-modal/memebership-modal.component';
import { StudentDetailComponent } from '../student-detail.component';

@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCoursesComponent implements OnInit {
  student: any
  courses: any[] = []
  showButtons: boolean = false

  constructor(private studentdetail: StudentDetailComponent, private rest: RestService) { }

  ngOnInit(): void {
    this.student = this.studentdetail.student
    this.getStudentCourses(1)
  }
  getStudentCourses(page) {
    this.rest.getStudentCourses(this.student.id, page).subscribe(res => {
      console.log(res);
      res.results.forEach(element => {
        this.courses.push(element)
      });
      if (res.total_pages > page) {
        page++
        this.getStudentCourses(page)
      }
    })
  }
  changeStatus(event, course) {
    this.showButtons = this.courses.some(el => el.checked === true);

    if (event) {
      course.checked = true
    } else {
      course.checked = false
    }
  }


}
