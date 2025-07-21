import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraccionamientoComponent } from './fraccionamiento.component';

describe('FraccionamientoComponent', () => {
  let component: FraccionamientoComponent;
  let fixture: ComponentFixture<FraccionamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraccionamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraccionamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
