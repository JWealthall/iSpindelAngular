import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryService } from '../services/summary.service';
import { Summary } from '../models/Summary';
import { ActivatedRoute } from '@angular/router';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})

export class DeviceComponent implements OnInit {
  summary$: Observable<Summary>;
  deviceId: Guid;

  constructor(private summaryService: SummaryService, private avRoute: ActivatedRoute) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.deviceId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.summary$ = this.summaryService.getDeviceSummary(this.deviceId);
  }
}
