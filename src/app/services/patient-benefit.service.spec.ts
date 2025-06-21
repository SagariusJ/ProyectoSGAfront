import { TestBed } from '@angular/core/testing';

import { PatientBenefitService } from './patient-benefit.service';

describe('PatientBenefitService', () => {
  let service: PatientBenefitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientBenefitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
