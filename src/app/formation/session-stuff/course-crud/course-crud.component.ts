import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from "@angular/forms";
import { RestService } from "../../../services/rest.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from "@angular/router";
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-course-crud',
  templateUrl: './course-crud.component.html',
  styleUrls: ['./course-crud.component.css']
})
export class CourseCRUDComponent implements OnInit {
  courseForm: FormGroup;
  sceduleForm: FormGroup;
  submit: boolean = false
  professors: any[] = []
  myConfig = {
    option: {
      minute: false,
      hour: false,
      year: false,
    },
    multiple: true
  }
  @ViewChild('addFormationModal', { static: false }) addFormationModal: ModalDirective;
  @Input() courses: any
  @Input() session: any
  @Input() course: any
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  maxDate: Date;

  saveAction: boolean = false
  constructor(private translateService: TranslateService, private toast: ToastrService, private fb: FormBuilder, private rest: RestService, private route: ActivatedRoute, private localeService: BsLocaleService, private router: Router) {
    this.bsConfig = Object.assign({}, { containerClass: "theme-blue" });
    this.localeService.use("fr");
  }

  ngOnInit(): void {
    this.courseForm = this.fb.group({
      name: new FormControl("", Validators.required),
      description: new FormControl("",),
      fee: new FormControl("", [Validators.required, Validators.pattern(/^\d+(\.\d{1,9})?$/)]),
      center: new FormControl(null, Validators.required),
      session: new FormControl(null, Validators.required),
      teacher: new FormControl(null, Validators.required),
      capacity: new FormControl("", [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      starting_date: new FormControl(new Date(), Validators.required),
      finishing_date: new FormControl(new Date(), Validators.required),
    });
    if (this.session) {
      this.courseForm.patchValue({
        starting_date: new Date(this.session.starting_date),
        finishing_date: new Date(this.session.finishing_date)
      })
      this.maxDate = new Date(this.session.finishing_date)
      this.minDate = new Date(this.session.starting_date)
    }
    this.sceduleForm = this.fb.group({
      scheduls: this.fb.array([
        this.addSkillFormGroup()
      ])
    })
    this.getProfessors(1)
    if (this.course) {
      this.courseForm.patchValue({
        name: this.course.name,
        description: this.course.description,
        fee: this.course.fee,
        teacher: this.course.teacher,
        capacity: this.course.capacity,
        starting_date: new Date(this.course.starting_date || new Date()),
        finishing_date: new Date(this.course.finishing_date || new Date()),
        start_at: new Date(new Date().setHours(this.course.start_at)),
        finish_at: new Date(),
        repeat: this.course.repeat,
      })
      if (this.course.schedules_verbose.length > 0) {
        this.sceduleForm.setControl('scheduls', this.setExistingSkills(this.course.schedules_verbose));
      }

    }
  }
  setExistingSkills(skillSets): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      switch (s.repeat) {
        case "* * * * SUN":
          s.repeat = "SUN"
          break;
        case "* * * * MON":
          s.repeat = "MON"
          break;
        case "* * * * TUE":
          s.repeat = "TUE"
          break;
        case "* * * * WED":
          s.repeat = "WED"
          break;
        case "* * * * THU":
          s.repeat = "THU"
          break;
        case "* * * * FRI":
          s.repeat = "FRI"
          break;
        case "* * * * SAT":
          s.repeat = "SAT"
          break;
      }

      let start_at = new Date();
      start_at.setHours(s.start_at.split(':')[0]);
      start_at.setMinutes(s.start_at.split(':')[1])
      let finish_at = new Date();
      finish_at.setHours(s.finish_at.split(':')[0]);
      finish_at.setMinutes(s.finish_at.split(':')[1])
      formArray.push(this.fb.group({
        start_at: start_at,
        finish_at: finish_at,
        repeat: s.repeat,
        disabled: true
      }));
    });

    return formArray;
  }
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      start_at: new FormControl("", [Validators.required,]),
      finish_at: new FormControl("", [Validators.required,]),
      repeat: new FormControl(null, Validators.required),
      disabled: false,
    });
  }
  addCourseClick(): void {
    (<FormArray>this.sceduleForm.get('scheduls')).push(this.addSkillFormGroup());
  }
  get f() { return this.courseForm.controls }

  setfixedValues() {
    if (this.course) {
      this.courseForm.controls['center'].setValue(this.course.center)

    } else {
      this.courseForm.controls['center'].setValue(this.session.center)
    }
    this.courseForm.controls['session'].setValue(this.route.snapshot.params['id'])

  }
  getProfessors(page) {
    let center: any
    if (this.course) {
      center = this.course.center

    } else {
      center = this.session.center
    }
    this.rest.get('/centers/' + center + '/teachers/?page=' + page).subscribe(res => {
      if (res?.status === 200) {
        res.body.results.forEach(element => {
          this.professors.push(element)
        });
        if (res.body.total_pages > page) {
          page++
          this.getProfessors(page)
        }
      }
    })
  }
  crudCourse() {
    this.submit = true
    this.setfixedValues()
    if (this.courseForm.invalid || this?.sceduleForm.invalid) {
      return
    }
    if (this.course) {
      this.rest.patch('/courses/' + this.course.id + "/", this.rest.getDirtyValues(this.courseForm)).subscribe(res => {
        if (res.status === 200) {
          this.addSchedules(res.body.id)
          this.translateService.get('Le cours a modifié  avec success').subscribe(result => {
            this.translateService.get('Opération terminée').subscribe(res => {
              this.toast.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
            })
          })
          Object.assign(this.course, res.body)
          this.addFormationModal.hide()
        }
      })

    } else {
      this.rest.post('/courses/', this.courseForm.value).subscribe(res => {
        if (res?.status === 201) {
          this.addSchedules(res.body.id)
          this.translateService.get('Le cours a été crée avec success').subscribe(result => {
            this.translateService.get('Opération terminée').subscribe(res => {
              this.toast.success(result, res, { positionClass: this.translateService.currentLang === "ar" ? 'toast-bottom-left' : "toast-bottom-right" });
            })
          })
          this.courses.unshift(res.body)
          this.submit = false
          this.courseForm.reset()
          this.setfixedValues()
          if (this.saveAction) {
            this.router.navigate(['./course-details/' + res.body.id], { relativeTo: this.route })
            this.addFormationModal.hide()
          }
        }
      })
    }
  }
  addSchedules(id) {
    this.sceduleForm.value.scheduls.forEach(element => {
      switch (element.repeat) {
        case "SUN":
          element.repeat = "* * * * SUN"
          break;
        case "MON":
          element.repeat = "* * * * MON"
          break;
        case "TUE":
          element.repeat = "* * * * TUE"
          break;
        case "WED":
          element.repeat = "* * * * WED"
          break;
        case "THU":
          element.repeat = "* * * * THU"
          break;
        case "FRI":
          element.repeat = "* * * * FRI"
          break;
        case "SAT":
          element.repeat = "* * * * SAT"
          break;
      }
      element.course = id
      if (!element.disabled) {

        let start_hour = new Date(element.start_at).getHours()
        let start_minit = new Date(element.start_at).getMinutes()
        let finish_hour = new Date(element.finish_at).getHours()
        let finish_minit = new Date(element.finish_at).getMinutes()
        element.start_at = start_hour.toString().padStart(2, "0") + ':' + start_minit.toString().padStart(2, "0")
        element.finish_at = finish_hour.toString().padStart(2, "0") + ':' + finish_minit.toString().padStart(2, "0")
        this.rest.post('/courses/schedules/', element).subscribe(result => {
          if (result?.status === 201) {
            element.disabled = true
            if (this.course) {
              this.course.schedules_verbose.unshift(result.body)
              this.sceduleForm.get('scheduls')['controls'][this.sceduleForm.get('scheduls')['controls'].length - 1].controls.disabled.value = true
              this.course.schedules_verbose.forEach(element => {
                this.rest.justifyText(element)
              });
            }

          }
        })
      }
    });
  }
  setMinDate() {
    this.minDate = new Date()
    this.minDate = this.courseForm.controls['starting_date'].value
    this.minDate.setDate(this.minDate.getDate());
  }
}