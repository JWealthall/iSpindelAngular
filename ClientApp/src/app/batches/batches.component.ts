import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryService } from '../services/summary.service';
import { Summary } from '../models/Summary';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css']
})

export class BatchesComponent implements OnInit {
  summary$: Observable<Summary>;

  constructor(private summaryService: SummaryService) { }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.summary$ = this.summaryService.getBatchesSummary();
  }
}
