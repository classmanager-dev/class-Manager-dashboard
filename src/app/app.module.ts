import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, DatePipe, AsyncPipe } from '@angular/common';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// *******************************************************NgxPrintModule ****************************************************** 
import { NgxPrintModule } from 'ngx-print';
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

defineLocale('fr', frLocale);

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
import { TrialAccountComponent } from './trial-account/trial-account.component';
import { LoginComponent } from './login/login.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ManageCenterComponent } from './training-center/manage-center/manage-center.component';
import { ProfessorsDetailsComponent } from './professors/professors-details/professors-details.component';
import { ProfessorsModificationComponent } from './professors/professors-details/professors-modification/professors-modification.component';
import { ProfessorsInformationComponent } from './professors/professors-details/professors-information/professors-information.component';
import { ManageProfessorsComponent } from './professors/manage-professors/manage-professors.component';
import { PresenceComponent } from './students/student-detail/presence/presence.component';


const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'dashboard/dashboard-details',
        component: DashboardDetailsComponent
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
        component: SettingsComponent
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
    path: 'login',
    component: LoginComponent
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
    PresenceComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
  ],
  providers: [AlertConfig, PopoverConfig, AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
