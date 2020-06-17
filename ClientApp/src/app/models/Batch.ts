import { Guid } from "guid-typescript";
import { BaseData } from "./BaseData";
import { Log } from "./Log";

export class Batch extends BaseData {
  batchId: Guid;
  description: string;
  startDate: Date;
  endDate?: Date;
  deviceId: Guid;
  logs: Log[];
}
