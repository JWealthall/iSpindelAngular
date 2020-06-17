import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BatchService } from "../services/batch.service";
import { Batch } from "../models/Batch";
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from "guid-typescript";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-batch-edit',
  templateUrl: './batch-edit.component.html',
  styleUrls: ['./batch-edit.component.css']
})
export class BatchEditComponent implements OnInit {
  batchId: Guid;
  batch: Batch;

  batchForm = this.fb.group({
    deviceId: [''],
    batchId: [''],
    startDate: [''],
    endDate: [''],
    description: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor(private batchService: BatchService, private avRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.batchId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.batchService.getBatch(this.batchId).subscribe(d => {
      this.batch = d;
      this.batchForm.patchValue(this.batch);
    });
  }

  onSubmit() {
    if (!this.batchForm.valid) return;

    let batUpd: Batch = this.batchForm.value;
    this.batchService.updateBatch(this.batchId, batUpd).subscribe(b => {
      this.batch = b;
      this.batchForm.patchValue(b);
      // If this worked then route to something else.  If not leave form to show error
      if (b.statusData.code === 0) this.router.navigate(["batch", b.batchId]);
    });
  }
}
