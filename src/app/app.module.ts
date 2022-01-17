import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, DatePipe, AsyncPipe } from '@angular/common';
import { NgxJdenticonModule, JDENTICON_CONFIG } from 'ngx-jdenticon';
// *******************************************************Canlendar  ****************************************************** 
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/timegrid'; // a plugin!

// *******************************************************Error Handler ****************************************************** 
import { NgModule ,ErrorHandler} from '@angular/core';
import { HttpClientModule ,HTTP_INTERCEPTORS,HttpClient} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// *******************************************************NgxPrintModule ****************************************************** 
import { NgxPrintModule } from 'ngx-print';
import { AvatarModule } from 'ngx-avatar';

// *******************************************************Bootstrap Componennts******************************************************* 
import { AlertModule, AlertConfig } from 'ngx-bootstrap/alert';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale, } from 'ngx-bootstrap/locale';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
// *******************************************************Chart Module******************************************************* 

import { ChartsModule } from 'ng2-charts';

defineLocale('fr', frLocale);
// *******************************************************Cron Module******************************************************* 
import { CronJobsModule } from 'ngx-cron-jobs';
// *******************************************************Toas service******************************************************* 
import { ToastrModule } from 'ngx-toastr';

// *******************************************************Translate service******************************************************* 
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

// *******************************************************Componennts******************************************************* 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormationComponent } from './formation/formation.component';
import { HomeComponent } from './home/home.component';
import { PaimentComponent } from './paiment/paiment.component';
import { ProfessorsComponent } from './professors/professors.component';
import { SettingsComponent } from './settings/settings.component';
import { StudentsComponent } from './students/students.component';
import { TrainingCenterComponent } from './training-center/training-center.component';
import { TestComponent } from './test/test.component';
import { SessionStuffComponent } from './formation/session-stuff/session-stuff.component';
import { SessionDetailsComponent } from './formation/session-stuff/session-details/session-details.component';
import { InformationComponent } from './formation/session-stuff/session-details/information/information.component';
import { ModifcationComponent } from './formation/session-stuff/session-details/modifcation/modifcation.component';
import { StudentdetailsComponent } from './formation/session-stuff/session-details/studentdetails/studentdetails.component';
import { DashboardDetailsComponent } from './dashboard/dashboard-details/dashboard-details.component';
import { TrainingCentreDetailsComponent } from './training-center/training-centre-details/training-centre-details.component';
import { TrainingCentreInformationComponent } from './training-center/training-centre-details/training-centre-information/training-centre-information.component';
import { CentreStateComponent } from './training-center/training-centre-details/centre-state/centre-state.component';
import { TrainingCentreModificationComponent } from './training-center/training-centre-details/training-centre-modification/training-centre-modification.component';
import { StudentDetailComponent } from './students/student-detail/student-detail.component';
import { StudentPaimentsComponent } from './students/student-detail/student-paiments/student-paiments.component';
import { StudentModificationComponent } from './students/student-detail/student-modification/student-modification.component';
import { StudentInformationComponent } from './students/student-detail/student-information/student-information.component';
import { StudentModalComponent } from './students/student-modal/student-modal.component';

// *******************************************************Services******************************************************* 
import { AuthGuard } from "./guards/auth.guard";
import { PermissionsGuard } from "./guards/permissions.guard";
import { HttpErrorInterceptor } from './services/http-error.interceptor';
import { ErrorService } from "./services/error.service";
import { TrialAccountComponent } from './trial-account/trial-account.component';
import { LoginComponent } from './login/login.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ManageCenterComponent } from './training-center/manage-center/manage-center.component';
import { ProfessorsDetailsComponent } from './professors/professors-details/professors-details.component';
import { ProfessorsModificationComponent } from './professors/professors-details/professors-modification/professors-modification.component';
import { ProfessorsInformationComponent } from './professors/professors-details/professors-information/professors-information.component';
import { ManageProfessorsComponent } from './professors/manage-professors/manage-professors.component';
import { PresenceComponent } from './students/student-detail/presence/presence.component';
import { CourseCRUDComponent } from './formation/session-stuff/course-crud/course-crud.component';
import { StudentCoursesComponent } from './students/student-detail/student-courses/student-courses.component';
import { MemebershipModalComponent } from './students/memebership-modal/memebership-modal.component';
import { Page403Component } from './errorPages/page403/page403.component';
import { Page404Component } from './errorPages/page404/page404.component';
import { LoadingComponent } from './loading/loading.component';
import { CalendarComponent } from './calendar/calendar.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SubscriptionsComponent } from './training-center/training-centre-details/subscriptions/subscriptions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { IndexComponent } from './index/index.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);
const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardDetailsComponent,
        canActivate: [PermissionsGuard],
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [PermissionsGuard],
      },
      {
        path: 'dashboard/dashboard-details',
        component: DashboardDetailsComponent,
        canActivate: [PermissionsGuard],
      },
      {
        path: 'test',
        component: TestComponent
      },
      {
        path: 'formation',
        component: FormationComponent
      },
      {
        path: 'formation/stuff/:id',
        component: SessionStuffComponent
      },
      {
        path: 'formation/stuff/:id/course-details/:courseId',
        component: SessionDetailsComponent,
        children: [
          {
            path: 'information',
            component: InformationComponent
          },
          {
            path: 'student-details',
            component: StudentdetailsComponent
          },
          {
            path: 'modification',
            component: ModifcationComponent
          },
          {
            path: '',
            redirectTo: 'information',
            pathMatch: 'full'
          },
        ]
      },
      {
        path: 'paiment',
        component: PaimentComponent
      }, {
        path: 'professeurs',
        component: ProfessorsComponent
      }, {
        path: 'professeurs/details/:id',
        component: ProfessorsDetailsComponent,
        children: [
          {
            path: 'information',
            component: ProfessorsInformationComponent
          },
          {
            path: 'modification',
            component: ProfessorsModificationComponent
          },
          {
            path: '',
            redirectTo: 'information',
            pathMatch: 'full'
          },
        ]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [PermissionsGuard],
      },
      {
        path: 'traingCentres',
        component: TrainingCenterComponent
      },
      {
        path: 'traingCentres/details/:id',
        component: TrainingCentreDetailsComponent,
        children: [
          {
            path: 'information',
            component: TrainingCentreInformationComponent
          },
          {
            path: 'centre-state',
            component: CentreStateComponent
          },
          {
            path: 'modification',
            component: TrainingCentreModificationComponent
          },
          {
            path: 'subscriptions',
            component: SubscriptionsComponent
          },
          {
            path: '',
            redirectTo: 'information',
            pathMatch: 'full'
          },
        ]

      },
      {
        path: 'students',
        component: StudentsComponent
      },
      {
        path: 'students/detail/:id',
        component: StudentDetailComponent,
        children: [
          {
            path: 'information',
            component: StudentInformationComponent
          },
          {
            path: 'paiment',
            component: StudentPaimentsComponent
          },
          {
            path: 'presence',
            component: PresenceComponent
          },
          {
            path: 'modification',
            component: StudentModificationComponent
          },
          {
            path: 'courses',
            component: StudentCoursesComponent
          },
          {
            path: '',
            redirectTo: 'information',
            pathMatch: 'full'
          },
        ]

      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'trial-account',
    component: TrialAccountComponent
  },
  {
    path: '403',
    component: Page403Component
  },
  {
    path: '404',
    component: Page404Component
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'index',
    component: IndexComponent,
    children:[ {
      path: '',
      component: LandingPageComponent
    },
    {
      path: 'privacyPolicy',
      component: PrivacyPolicyComponent
    }
  ]
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  },

]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FormationComponent,
    HomeComponent,
    PaimentComponent,
    ProfessorsComponent,
    SettingsComponent,
    StudentsComponent,
    TrainingCenterComponent,
    TestComponent,
    SessionStuffComponent,
    SessionDetailsComponent,
    InformationComponent,
    ModifcationComponent,
    StudentdetailsComponent,
    DashboardDetailsComponent,
    TrainingCentreDetailsComponent,
    TrainingCentreInformationComponent,
    CentreStateComponent,
    TrainingCentreModificationComponent,
    StudentDetailComponent,
    StudentPaimentsComponent,
    StudentModificationComponent,
    StudentInformationComponent,
    StudentModalComponent,
    TrialAccountComponent,
    LoginComponent,
    ConfirmationModalComponent,
    ManageCenterComponent,
    ProfessorsDetailsComponent,
    ProfessorsModificationComponent,
    ProfessorsInformationComponent,
    ManageProfessorsComponent,
    PresenceComponent,
    CourseCRUDComponent,
    StudentCoursesComponent,
    MemebershipModalComponent,
    Page403Component,
    Page404Component,
    LoadingComponent,
    CalendarComponent,
    LandingPageComponent,
    SubscriptionsComponent,
    PrivacyPolicyComponent,
    IndexComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FullCalendarModule ,
    NgxJdenticonModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule,
    RouterModule.forRoot(routes),
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    NgSelectModule,
    CronJobsModule,
    ChartsModule,
    AvatarModule,
    TimepickerModule.forRoot(),
    ToastrModule.forRoot({
      timeOut:5000,
      positionClass: 'toast-bottom-right',
      closeButton: true
    }),
  ],
  providers: [AlertConfig, PopoverConfig, AuthGuard, DatePipe, PermissionsGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide:HTTP_INTERCEPTORS,useClass:HttpErrorInterceptor,multi:true},
    // {provide: ErrorHandler,useClass: ErrorService},
    { 
      // Optional custom identicon style
      // http://localhost:8080/icon-designer.html?config=222222ff014132321e363f52
      provide: JDENTICON_CONFIG,
      useValue: {
        lightness: {
          color: [0.30, 0.54],
          grayscale: [0.63, 0.82],
        },
        saturation: {
          color: 0.50,
          grayscale: 0.50,
        },
        backColor: "#fff",
      },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
