import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchEditComponent } from './batch-edit.component';

describe('BatchEditComponent', () => {
  let component: BatchEditComponent;
  let fixture: ComponentFixture<BatchEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
