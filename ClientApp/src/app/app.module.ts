import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeEnGb from '@angular/common/locales/en-gb';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { DevicesComponent } from "./devices/devices.component";
import { DeviceComponent } from './device/device.component';
import { DeviceEditComponent } from './device-edit/device-edit.component';
import { BatchesComponent } from './batches/batches.component';
import { BatchComponent } from './batch/batch.component';
import { BatchEditComponent } from './batch-edit/batch-edit.component';
import { BatchEndComponent } from './batch-end/batch-end.component';
import { BatchNewComponent } from './batch-new/batch-new.component';
import { ChartComponent } from './chart/chart.component';
import { LogDeleteComponent } from './log-delete/log-delete.component';
import { BatchSummaryComponent } from './batch-summary/batch-summary.component';
import { DeviceSummaryComponent } from './device-summary/device-summary.component';

import { BatchService } from './services/batch.service';
import { DeviceService } from './services/device.service';
import { LogService } from './services/log.service';
import { SummaryService } from "./services/summary.service";
import { InputErrorComponent } from './input-error/input-error.component';

registerLocaleData(localeEnGb);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    DevicesComponent,
    DeviceComponent,
    DeviceEditComponent,
    BatchesComponent,
    BatchComponent,
    BatchEditComponent,
    BatchEndComponent,
    ChartComponent,
    LogDeleteComponent,
    BatchSummaryComponent,
    DeviceSummaryComponent,
    InputErrorComponent,
    BatchNewComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'device', component: DevicesComponent },
      { path: 'device/:id', component: DeviceComponent },
      { path: 'device/edit/:id', component: DeviceEditComponent },
      { path: 'batch', component: BatchesComponent },
      { path: 'batch/:id', component: BatchComponent },
      { path: 'batch/edit/:id', component: BatchEditComponent },
      { path: 'batch/end/:id', component: BatchEndComponent },
      { path: 'batch/new/:id', component: BatchNewComponent },
      { path: 'batch/chart/:id', component: ChartComponent },
      { path: 'log/delete/:id', component: LogDeleteComponent },
      { path: '**', redirectTo: '/' },
    ]),
  ],
  providers: [
    BatchService,
    DeviceService,
    LogService,
    SummaryService,
    { provide: LOCALE_ID, useValue: "en-gb" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
