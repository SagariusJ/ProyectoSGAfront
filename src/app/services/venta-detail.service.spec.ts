import { TestBed } from '@angular/core/testing';

import { VentaDetailService } from './venta-detail.service';

describe('VentaDetailService', () => {
  let service: VentaDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentaDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
