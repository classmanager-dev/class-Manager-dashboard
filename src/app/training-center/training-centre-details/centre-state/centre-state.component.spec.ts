import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreStateComponent } from './centre-state.component';

describe('CentreStateComponent', () => {
  let component: CentreStateComponent;
  let fixture: ComponentFixture<CentreStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
