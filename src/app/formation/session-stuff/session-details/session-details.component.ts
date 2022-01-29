import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { RestService } from "../../../services/rest.service";
import { StudentdetailsComponent } from "./studentdetails/studentdetails.component";
import { ConfirmationModalComponent } from "../../../confirmation-modal/confirmation-modal.component"
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css']
})
export class SessionDetailsComponent implements OnInit {
  selectedCityName = 'Active';
  param: any
  session: any
  course: any
  students:any[]=[]
  student:any
  activateRoute: string
  status = [
    { id: 1, name: 'Active' },
    { id: 2, name: 'No active' },

  ];
  @ViewChild('addStudent', { static: false }) addStudent: ModalDirective;
  @ViewChild('StudentdetailsComponent') StudentdetailsComponent: StudentdetailsComponent;
  @ViewChild('deleteModal') deleteModal: ConfirmationModalComponent;
  constructor(private translateService: TranslateService, private toastr: ToastrService, public route: ActivatedRoute, private rest: RestService) { }
  ngOnInit(): void {
    this.param = this.route.snapshot.params['id']
    let idLength = this.route.snapshot.params['id'].length
    let courseIdLength = this.route.snapshot.params['courseId'].length
    this.activateRoute = window.location.hash.substring(35 + idLength + courseIdLength)
    this.getCourse(this.route.snapshot.params['courseId'])
    this.getSEssion(this.param)
  }
  getSEssion(id) {
    this.rest.get('/sessions/' + id).subscribe(res => {
      if (res?.status === 200) {
        this.session = res.body
      }
    })
  }
  getCourse(id) {
    this.rest.get('/courses/' + id).subscribe(res => {
      console.log(res.body);
      
      if (res?.status === 200) {
        this.course = res.body
        this.course.status = "active"
      }
    })
  }
  changeRoute(route) {
    this.activateRoute = route
  }
  onConfirm(event) {
    this.StudentdetailsComponent.checkedStudents.forEach(element => {
      console.log(this.course.id);
      element.memberships_verbose.forEach(ms => {
        if (ms.course === this.course.id) {
          this.rest.delete('/memberships/' + ms.id + '/').subscribe(res => {
            if (res.status === 204) {
              this.translateService.get('ne suit plus ce cours').subscribe(result => {
                this.translateService.get('Opération terminée').subscribe(res => {
                  this.toastr.success(element.user.name + element.user.family_name + result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
                })
              })
              for (let index = 0; index < this.StudentdetailsComponent.students.length; index++) {
                if (this.StudentdetailsComponent.students[index].id === element.id) {
                  this.StudentdetailsComponent.students.splice(index, 1)
                }
              }
              this.deleteModal.deleteModal.hide()
            }
          })
        }
      });
    });
  }
  openStudentModal(){
    console.log(this.session.center);
    this.addStudent.show()
  }
  getStudents(page){    
    if (this.student) {
      this.rest.get("/centers/"+this.session.center+"/students/?search="+this.student+"&page="+page).subscribe(res=>{      
        res.body.results.forEach(element => {
          const index = this.students.findIndex(object => object.id === element.id);
          if (index === -1) {
            this.students.push(element)
          }
        });
        if (res.body.total_pages>page) {
          page++
          this.getStudents(page)
        }
       })
    }
  }
  deleteStudent(index){
   this.students.splice(index,1)
  }
  addMemeberShip(){
    let students:any[]=[]
    this.students.forEach(student => {
      const index = student.memberships_verbose.findIndex(object => object.course === this.course.id);      
        if (index === -1 ) {
          students.push(student)
          console.log(students);
        }
    });    
    console.log(students);
    
    students.forEach(element => {
      let date = new Date();
      let form ={student:element.id,course:this.course.id,session:this.course.session,registeration_date:date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}
      this.rest.post('/memberships/',form).subscribe(res => {
        if (res.status === 201) {
          this.addStudent.hide()
          this.toastr.success('l\'étudiant avec l\'id ' + res.body.student + " est attachée a la formation " + res.body.course_verbose.name + " avec success", 'Opération terminée')
          this.StudentdetailsComponent.students.push(element)
          element.memberships_verbose.push(res.body)
          console.log(element);
          
        }
      })
    });
    
  }
}


