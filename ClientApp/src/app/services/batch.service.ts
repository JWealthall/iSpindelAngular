import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Batch } from '../models/Batch';
import { Guid } from "guid-typescript";

@Injectable({
  providedIn: 'root'
})

export class BatchService {

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

  createBatch(batch: Batch): Observable<Batch> {
    return this.http.post<Batch>(this.myAppUrl + this.myApiUrl + 'batchCreate', batch)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  endBatch(batchId: Guid, batch: Batch): Observable<Batch> {
    return this.http.post<Batch>(this.myAppUrl + this.myApiUrl + 'batchEnd/' + batchId, batch)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getBatch(batchId: Guid): Observable<Batch> {
    return this.http.get<Batch>(this.myAppUrl + this.myApiUrl + 'batch/' + batchId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getBatchList(): Observable<Batch[]> {
    return this.http.get<Batch[]>(this.myAppUrl + this.myApiUrl + 'batchList')
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateBatch(batchId: Guid, batch: Batch): Observable<Batch> {
    return this.http.post<Batch>(this.myAppUrl + this.myApiUrl + 'batchUpdate/' + batchId, batch)
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
