import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LogService } from "../services/log.service";
import { Log } from "../models/Log";
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from "guid-typescript";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-log-delete',
  templateUrl: './log-delete.component.html',
  styleUrls: ['./log-delete.component.css']
})
export class LogDeleteComponent implements OnInit {
  logId: Guid;
  batchId: Guid;
  log: Log;

  logForm = this.fb.group({
    logId: [''],
    date: [''],
    angle: [''],
    temperature: [''],
    tempUnits: [''],
    battery: [''],
    gravity: [''],
    interval: [''],
    rssi: [''],
    deviceId: [''],
    batchId: [''],
  });

  constructor(private logService: LogService, private avRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.logId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.logService.getLog(this.logId).subscribe(d => {
      this.log = d;
      this.logForm.patchValue(this.log);
      this.batchId = d.batchId;
    });
  }

  onSubmit() {
    this.logService.deleteLog(this.logId, this.log).subscribe(b => {
      this.log = b;
      this.logForm.patchValue(b);
      // If this worked then route to something else.  If not leave form to show error
      if (b.statusData.code === 0) this.router.navigate(["batch", b.batchId]);
    });
  }
}
