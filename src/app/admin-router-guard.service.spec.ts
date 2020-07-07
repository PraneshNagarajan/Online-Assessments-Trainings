import { TestBed } from '@angular/core/testing';

import { AdminRouterGuardService } from './admin-router-guard.service';

describe('AdminRouterGuardService', () => {
  let service: AdminRouterGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRouterGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
