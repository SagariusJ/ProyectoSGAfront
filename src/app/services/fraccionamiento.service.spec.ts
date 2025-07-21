import { TestBed } from '@angular/core/testing';

import { FraccionamientoService } from './fraccionamiento.service';

describe('FraccionamientoService', () => {
  let service: FraccionamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FraccionamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
