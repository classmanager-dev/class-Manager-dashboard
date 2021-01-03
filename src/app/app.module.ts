import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// *******************************************************Bootstrap Componennts******************************************************* 
import { AlertModule, AlertConfig } from 'ngx-bootstrap/alert';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { NgSelectModule } from '@ng-select/ng-select';
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
import { AppBarComponent } from './formation/session-stuff/session-details/app-bar/app-bar.component';
import { TrainingCentreDetailsComponent } from './training-center/training-centre-details/training-centre-details.component';
import { TrainingCentreInformationComponent } from './training-center/training-centre-details/training-centre-information/training-centre-information.component';
import { CentreStateComponent } from './training-center/training-centre-details/centre-state/centre-state.component';
import { TrainingCentreModificationComponent } from './training-center/training-centre-details/training-centre-modification/training-centre-modification.component';
import { StudentDetailComponent } from './students/student-detail/student-detail.component';



const routes: Routes = [

  {
    path: '',
    component: HomeComponent,
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
        path: 'formation/stuff',
        component: SessionStuffComponent
      },
      {
        path: 'formation/stuff/details',
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
        path: 'settings',
        component: SettingsComponent
      }, {
        path: 'students',
        component: StudentsComponent
      }, {
        path: 'traingCentres',
        component: TrainingCenterComponent
      },
      {
        path: 'traingCentres/details',
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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ]
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
    AppBarComponent,
    TrainingCentreDetailsComponent,
    TrainingCentreInformationComponent,
    CentreStateComponent,
    TrainingCentreModificationComponent,
    StudentDetailComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgSelectModule,
    ],
  providers: [AlertConfig, PopoverConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
