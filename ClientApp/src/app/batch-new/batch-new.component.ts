import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceService } from '../services/device.service';
import { Device } from "../models/Device";
import { BatchService } from "../services/batch.service";
import { Batch } from "../models/Batch";
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from "guid-typescript";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-batch-new',
  templateUrl: './batch-new.component.html',
  styleUrls: ['./batch-new.component.css']
})
export class BatchNewComponent implements OnInit {
  deviceId: Guid;
  device: Device;
  batch: Batch;

  batchForm = this.fb.group({
    deviceId: [''],
    batchId: [''],
    startDate: [''],
    description: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor(private deviceService: DeviceService, private batchService: BatchService, private avRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.deviceId = this.avRoute.snapshot.params[idParam];
    }
    this.deviceService.getDevice(this.deviceId).subscribe(d => {
      this.device = d;
    });
  }

  ngOnInit() {
    this.batch = {
      deviceId: this.deviceId,
      batchId: Guid.create().toString() as unknown as Guid,
      startDate: new Date(),
      description: "",
    } as Batch;
    this.batchForm.patchValue(this.batch);
  }

  onSubmit() {
    if (!this.batchForm.valid) return;

    let batUpd: Batch = this.batchForm.value;
    this.batchService.createBatch(batUpd).subscribe(b => {
      this.batch = b;
      this.batchForm.patchValue(b);
      // If this worked then route to something else.  If not leave form to show error
      if (b.statusData.code === 0) this.router.navigate(["batch", b.batchId]);
    });
  }
}
