import { TestBed } from '@angular/core/testing';

import { DispersionService } from './dispersion.service';

describe('DispersionService', () => {
  let service: DispersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
