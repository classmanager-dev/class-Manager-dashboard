import { Component, OnInit, ViewChild, } from '@angular/core';
import { StudentModalComponent } from "./student-modal/student-modal.component";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { Router, ActivatedRoute } from "@angular/router";
import { RestService } from "../services/rest.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MemebershipModalComponent } from './memebership-modal/memebership-modal.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  showButtons: boolean = false
  @ViewChild('studentModal') studentModal: StudentModalComponent;
  @ViewChild('membershipModal') membershipModal: MemebershipModalComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  @ViewChild('membership', { static: false }) membership: ModalDirective;
  students: any
  student: any
  currentPage: any;
  page: number = 1
  constructor(private route: ActivatedRoute, public router: Router, private rest: RestService, ) {
  }
  ngOnInit() {
    this.route.queryParamMap.subscribe(param => {
      if (Number(param.get('page'))) {
        this.currentPage = Number(param.get('page'))
      } else {
        this.currentPage = 1;
      }
      this.getStudents(this.currentPage)
    })
  }

  gotoDetails(id) {
    this.router.navigate(['students/detail/' + id])
  }
  getStudents(page) {
    
      this.rest.authRefresh(this.rest.getStudents(page)).subscribe((res: any) => {
        console.log(res);
        this.students = res
        res.results.forEach(element => {
          element.checked = false
        });

      }) 
  }
 
  onConfirm(event) {
    console.log(this.student);
    this.rest.deleteStudent(this.student.id).subscribe(res => {
      for (let index = 0; index < this.students.results.length; index++) {
        if (this.students.results[index].id === this.student.id) {
          this.students.results.splice(index, 1)
          this.deleteModal.deleteModal.hide()
        }
      }
    })
  }
  showHiddenButtons(event, student) {
    this.showButtons = event
    this.students.results.forEach(element => {
      element.checked = false
    });
    student.checked = true
    this.student = student
  }
  
  pageChanged(event: any): void {
    this.page = event.page;
    this.router.navigate(['/students'], { queryParams: { page: this.page } });
  }  
}
