import { Guid } from "guid-typescript";
import { BaseData } from "./BaseData";

export class Log extends BaseData {
  logId: Guid;
  date?: Date;
  angle?: number;
  temperature?: number;
  tempUnits: string;
  battery?: number;
  gravity?: number;
  interval?: number;
  rssi?: number;
  deviceId: Guid;
  batchId?: Guid;
}
