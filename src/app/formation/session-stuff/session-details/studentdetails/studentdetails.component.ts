import { Component, OnInit, Input, ViewChild, } from '@angular/core';
import { SessionDetailsComponent } from "../session-details.component";
import { RestService } from "../../../../services/rest.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-studentdetails',
  templateUrl: './studentdetails.component.html',
  styleUrls: ['./studentdetails.component.css']
})
export class StudentdetailsComponent implements OnInit {
  course: any
  students: any = []
  checkedStudents: any[] = []
  showButton: boolean = false
  isLoaded: boolean = false
  constructor(private translateService: TranslateService, private toatsr: ToastrService, private detail: SessionDetailsComponent, private rest: RestService, private router: Router) { }
  ngOnInit(): void {
    this.course = this.detail.course
    this.getcourseStudents(1)
  }
  getcourseStudents(page) {
    this.rest.get('/courses/' + this.course.id + '/students/?page=' + page).subscribe(res => {
      if (res?.status === 200) {
        this.isLoaded = true
        res.body.results.forEach(element => {
          this.rest.get('/students/' + element.id + '/payments/?page=' + 1).subscribe(res => {
            if (res.status === 200) {
              res.body.results.forEach(amount => {
                element.checked = false
                element.amount = amount.amount
              });
            }
          })
          this.students.push(element)
        });
      }
    })
  }
  gotoStudents(studentId) {
    this.router.navigate(['students/detail/' + studentId])
  }
  showHiddenButtons(event, student) {
    const found = this.checkedStudents.some(el => el.id === student.id);
    if (event) {
      if (!found) this.checkedStudents.push(student);
      student.checked = true
    }
    else {
      if (found) {
        for (let index = 0; index < this.checkedStudents.length; index++) {
          if (this.checkedStudents[index].id === student.id) {
            this.checkedStudents.splice(index, 1)
          }

        }
      }
    }
  }
  onConfirm(event) {
    this.checkedStudents.forEach(element => {
      this.rest.delete('/memberships/' + element.id + '/').subscribe(res => {
        if (res.status === 204) {
          this.translateService.get('étudiant ne suit plus ce cours').subscribe(result => {
            this.translateService.get('Opération terminée').subscribe(res => {
              this.toatsr.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
            })
          })
        }
      })

    });

  }

}
