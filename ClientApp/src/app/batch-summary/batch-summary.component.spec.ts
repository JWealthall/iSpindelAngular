import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSummaryComponent } from './batch-summary.component';

describe('BatchSummaryComponent', () => {
  let component: BatchSummaryComponent;
  let fixture: ComponentFixture<BatchSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
