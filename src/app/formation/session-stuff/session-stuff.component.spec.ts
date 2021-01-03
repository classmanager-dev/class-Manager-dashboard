import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionStuffComponent } from './session-stuff.component';

describe('SessionStuffComponent', () => {
  let component: SessionStuffComponent;
  let fixture: ComponentFixture<SessionStuffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionStuffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionStuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
