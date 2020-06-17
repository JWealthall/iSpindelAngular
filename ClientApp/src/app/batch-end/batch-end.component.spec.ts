import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchEndComponent } from './batch-end.component';

describe('BatchEndComponent', () => {
  let component: BatchEndComponent;
  let fixture: ComponentFixture<BatchEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
