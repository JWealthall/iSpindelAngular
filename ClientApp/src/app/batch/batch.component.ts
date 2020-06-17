import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryService } from '../services/summary.service';
import { Summary } from '../models/Summary';
import { ActivatedRoute } from '@angular/router';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {
  summary$: Observable<Summary>;
  batchId: Guid;

  constructor(private summaryService: SummaryService, private avRoute: ActivatedRoute) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.batchId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.summary$ = this.summaryService.getBatchSummary(this.batchId);
  }
}
