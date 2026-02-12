import { TestBed } from '@angular/core/testing';

import { ImovelRepositoryService } from './imovel.repository.service';

describe('ImovelRepositoryService', () => {
  let service: ImovelRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImovelRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
