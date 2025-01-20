import { TestBed } from '@angular/core/testing';

import { QualificationsCacheService } from './qualifications-cache.service';

describe('QualificationsCacheService', () => {
  let service: QualificationsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualificationsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
