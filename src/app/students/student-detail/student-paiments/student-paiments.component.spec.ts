import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPaimentsComponent } from './student-paiments.component';

describe('StudentPaimentsComponent', () => {
  let component: StudentPaimentsComponent;
  let fixture: ComponentFixture<StudentPaimentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPaimentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPaimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
