import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Summary } from '../models/Summary';
import { Guid } from "guid-typescript";

@Injectable({
  providedIn: 'root'
})

export class SummaryService {

  myAppUrl: string;
  myApiUrl: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.appUrl;
    this.myApiUrl = 'data/';
  }

  getBatchSummary(batchId: Guid): Observable<Summary> {
    return this.http.get<Summary>(this.myAppUrl + this.myApiUrl + 'batchSummary/' + batchId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getBatchesSummary(): Observable<Summary> {
    return this.http.get<Summary>(this.myAppUrl + this.myApiUrl + 'batchesSummary')
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

    getDeviceSummary(deviceId: Guid): Observable<Summary> {
    return this.http.get<Summary>(this.myAppUrl + this.myApiUrl + 'deviceSummary/' + deviceId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getDevicesSummary(): Observable<Summary> {
    return this.http.get<Summary>(this.myAppUrl + this.myApiUrl + 'devicesSummary')
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(this.myAppUrl + this.myApiUrl + 'summary')
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
