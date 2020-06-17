import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchNewComponent } from './batch-new.component';

describe('BatchNewComponent', () => {
  let component: BatchNewComponent;
  let fixture: ComponentFixture<BatchNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
