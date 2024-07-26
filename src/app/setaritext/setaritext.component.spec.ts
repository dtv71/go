import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetaritextComponent } from './setaritext.component';

describe('SetaritextComponent', () => {
  let component: SetaritextComponent;
  let fixture: ComponentFixture<SetaritextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetaritextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetaritextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
