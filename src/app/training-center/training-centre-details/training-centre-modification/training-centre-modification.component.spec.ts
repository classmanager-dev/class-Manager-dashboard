import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCentreModificationComponent } from './training-centre-modification.component';

describe('TrainingCentreModificationComponent', () => {
  let component: TrainingCentreModificationComponent;
  let fixture: ComponentFixture<TrainingCentreModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCentreModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCentreModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
