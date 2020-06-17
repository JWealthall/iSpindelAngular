import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BatchSummary } from "../models/Summary";

@Component({
  selector: 'app-batch-summary',
  templateUrl: './batch-summary.component.html',
  styleUrls: ['./batch-summary.component.css']
})
export class BatchSummaryComponent implements OnInit {
  @Input('batch') batch: BatchSummary;

  constructor() { }

  ngOnInit() {
  }

}
