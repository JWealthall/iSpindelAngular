import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceSummary } from "../models/Summary";

@Component({
  selector: 'app-device-summary',
  templateUrl: './device-summary.component.html',
  styleUrls: ['./device-summary.component.css']
})
export class DeviceSummaryComponent implements OnInit {
  @Input('device') device: DeviceSummary;

  constructor() { }

  ngOnInit() {}

}
