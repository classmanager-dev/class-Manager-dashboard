import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifcationComponent } from './modifcation.component';

describe('ModifcationComponent', () => {
  let component: ModifcationComponent;
  let fixture: ComponentFixture<ModifcationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifcationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
