import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Log } from '../models/Log';
import { Guid } from "guid-typescript";

@Injectable({
  providedIn: 'root'
})
export class LogService {

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

  deleteLog(logId: Guid, log: Log): Observable<Log> {
    return this.http.post<Log>(this.myAppUrl + this.myApiUrl + 'logDelete/' + logId, log)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getLog(logId: Guid): Observable<Log> {
    return this.http.get<Log>(this.myAppUrl + this.myApiUrl + 'log/' + logId)
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
