import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitateComponent } from './activitate.component';

describe('ActivitateComponent', () => {
  let component: ActivitateComponent;
  let fixture: ComponentFixture<ActivitateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivitateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivitateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
