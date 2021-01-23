import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentModificationComponent } from './student-modification.component';

describe('StudentModificationComponent', () => {
  let component: StudentModificationComponent;
  let fixture: ComponentFixture<StudentModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
