import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomenclatorComponent } from './nomenclator.component';

describe('NomenclatorComponent', () => {
  let component: NomenclatorComponent;
  let fixture: ComponentFixture<NomenclatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NomenclatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NomenclatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
