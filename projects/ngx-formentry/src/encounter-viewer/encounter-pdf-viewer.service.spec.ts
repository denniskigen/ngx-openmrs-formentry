import { TestBed } from '@angular/core/testing';

import { EncounterPdfViewerService } from './encounter-pdf-viewer.service';

describe('EncounterPdfViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncounterPdfViewerService = TestBed.get(EncounterPdfViewerService);
    expect(service).toBeTruthy();
  });
});
