import { TestBed } from '@angular/core/testing';

import { DatabaseCommunicationService } from './database-communication.service';

describe('DatabaseCommunicationService', () => {
  let service: DatabaseCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
