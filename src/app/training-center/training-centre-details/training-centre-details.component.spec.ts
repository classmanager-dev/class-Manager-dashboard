import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCentreDetailsComponent } from './training-centre-details.component';

describe('TrainingCentreDetailsComponent', () => {
  let component: TrainingCentreDetailsComponent;
  let fixture: ComponentFixture<TrainingCentreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCentreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCentreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
