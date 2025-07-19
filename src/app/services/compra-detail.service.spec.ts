import { TestBed } from '@angular/core/testing';

import { CompraDetailService } from './compra-detail.service';

describe('CompraDetailService', () => {
  let service: CompraDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
