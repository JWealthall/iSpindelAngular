import { Guid } from "guid-typescript";
import { Batch } from "./Batch";

export class Summary {
  deviceId?: Guid;
  batchId?: Guid;
  devices?: DeviceSummary[];
  batches?: BatchSummary[];
  batch?: Batch;
  deviceName?: string;
  batchName?: string;
}

export class BatchSummary {
  batchId: Guid;
  description: string;
  tempUnits: string;
  startDate: Date;
  startGravity?: number;
  startTemperature?: number;
  endDate?: Date;
  endGravity?: number;
  endTemperature?: number;
  firstLogDate?: Date;
  lastLogDate?: Date;
  maxGravity?: number;
  minGravity?: number;
  maxTemperature?: number;
  minTemperature?: number;
  avgTemperature?: number;
  abv?: number;
  abvMaxMin?: number;
  duration?: number;
  isDetail: boolean;
}

export class DeviceSummary {
  deviceId: Guid;
  name: string;
  token: string;
  spindelId?: number;
  description: string;
  date?: Date;
  angle?: number;
  temperature?: number;
  tempUnits: string;
  battery?: number;
  gravity?: number;
  interval?: number;
  rssi?: number;
  isDetail: boolean;
}
