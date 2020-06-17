import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceService } from '../services/device.service';
import { Device } from "../models/Device";
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from "guid-typescript";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.css']
})
export class DeviceEditComponent implements OnInit {
  deviceId: Guid;
  device$: Observable<Device>;
  device: Device;

  deviceForm = this.fb.group({
    deviceId: [''],
    name: [''],
    spindelId: [''],
    description: ['', [Validators.required, Validators.maxLength(50)]],
    token: ['', [Validators.maxLength(100)]]
  });

  constructor(private deviceService: DeviceService, private avRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.deviceId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.loadSummary();
    this.device$.subscribe(d => {
      this.device = d;
      // Values can be set individually (which does more checks)
      this.deviceForm.patchValue(d);
    });
  }

  loadSummary() {
    this.device$ = this.deviceService.getDevice(this.deviceId);
  }

  onSubmit() {
    if (!this.deviceForm.valid) return;

    let devUpd: Device = this.deviceForm.value;
    this.deviceService.updateDevice(this.deviceId, devUpd).subscribe(d => {
      this.device = d;
      this.deviceForm.patchValue(d);
      // If this worked then route to something else.  If not leave form to show error
      if (d.statusData.code === 0) this.router.navigate(["device", this.deviceId]);
    });
  }

}
