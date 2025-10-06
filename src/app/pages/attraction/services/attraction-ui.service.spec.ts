import { TestBed } from '@angular/core/testing';

import { AttractionUiService } from './attraction-ui.service';

describe('AttractionUiService', () => {
  let service: AttractionUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttractionUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
