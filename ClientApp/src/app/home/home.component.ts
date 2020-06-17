import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryService } from '../services/summary.service';
import { Summary } from '../models/Summary';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  summary$: Observable<Summary>;

  constructor(private summaryService: SummaryService) { }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.summary$ = this.summaryService.getSummary();
  }
}
