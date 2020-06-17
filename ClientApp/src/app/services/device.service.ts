import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Device } from '../models/Device';
import { Guid } from "guid-typescript";

@Injectable({
  providedIn: 'root'
})

export class DeviceService {

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

  getDevice(deviceId: Guid): Observable<Device> {
    return this.http.get<Device>(this.myAppUrl + this.myApiUrl + 'device/' + deviceId)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  getDeviceList(): Observable<Device[]> {
    return this.http.get<Device[]>(this.myAppUrl + this.myApiUrl + 'deviceList')
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      );
  }

  updateDevice(deviceId: Guid, device: Device): Observable<Device> {
    return this.http.post<Device>(this.myAppUrl + this.myApiUrl + 'deviceUpdate/' + deviceId, device)
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
