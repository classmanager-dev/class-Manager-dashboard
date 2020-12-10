import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from "@angular/router";

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
// *******************************************************Bootstrap Componennts******************************************************* 
import { AlertModule, AlertConfig } from 'ngx-bootstrap/alert';
import { PopoverModule,PopoverConfig } from 'ngx-bootstrap/popover';
import { TestComponent } from './test/test.component';

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
        path: 'test',
        component: TestComponent
      },
      {
        path: 'formation',
        component: FormationComponent
      },{
        path: 'paiment',
        component: PaimentComponent
      },{
        path: 'professeurs',
        component: ProfessorsComponent
      },{
        path: 'settings',
        component: SettingsComponent
      },{
        path: 'students',
        component: StudentsComponent
      },{
        path: 'traingCentres',
        component: TrainingCenterComponent
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
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AlertModule.forRoot(),
    PopoverModule.forRoot()
  ],
  providers: [AlertConfig,PopoverConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
