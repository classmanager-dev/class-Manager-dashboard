import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from "../../../services/rest.service";
import { StudentDetailComponent } from "../student-detail.component";
@Component({
  selector: 'app-student-modification',
  templateUrl: './student-modification.component.html',
  styleUrls: ['./student-modification.component.css']
})
export class StudentModificationComponent implements OnInit {
  student: any
  logs: any 
  isLoaded: boolean = false
  currentPage: any;
  page: number = 1
  constructor(private router:Router,private route: ActivatedRoute, private rest: RestService, private studentdetail: StudentDetailComponent) { }
  ngOnInit(): void {
    this.student = this.studentdetail.student
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      this.getLogs(this.currentPage)
    })
  }
  getLogs(page) {
    this.rest.get("/students/" + this.student.id + "/logs/?page=" + page).subscribe(res => {
      if (res?.status === 200) {
        this.isLoaded = true
        this.logs = res.body
      }
    })
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/students/detail/'+this.student.id+'/modification'], { queryParams: { page: this.page } });
  }
}
