import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCentreInformationComponent } from './training-centre-information.component';

describe('TrainingCentreInformationComponent', () => {
  let component: TrainingCentreInformationComponent;
  let fixture: ComponentFixture<TrainingCentreInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCentreInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCentreInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
