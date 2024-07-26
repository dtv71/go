import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetarigeneraleComponent } from './setarigenerale.component';

describe('SetarigeneraleComponent', () => {
  let component: SetarigeneraleComponent;
  let fixture: ComponentFixture<SetarigeneraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetarigeneraleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetarigeneraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
