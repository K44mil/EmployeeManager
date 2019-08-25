import { TestBed } from '@angular/core/testing';

import { DeskService } from './desk.service';

describe('DeskService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeskService = TestBed.get(DeskService);
    expect(service).toBeTruthy();
  });
});
