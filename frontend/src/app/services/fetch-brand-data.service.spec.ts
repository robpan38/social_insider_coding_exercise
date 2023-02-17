import { TestBed } from '@angular/core/testing';

import { FetchBrandDataService } from './fetch-brand-data.service';

describe('FetchBrandDataService', () => {
  let service: FetchBrandDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchBrandDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
