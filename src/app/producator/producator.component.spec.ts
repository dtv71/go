import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducatorComponent } from './producator.component';

describe('ProducatorComponent', () => {
  let component: ProducatorComponent;
  let fixture: ComponentFixture<ProducatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProducatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProducatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
