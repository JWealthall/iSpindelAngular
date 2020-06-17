import { Guid } from "guid-typescript";
import { BaseData } from "./BaseData";

export class Device extends BaseData {
  deviceId: Guid;
  name: string;
  token: string;
  spindelId?: number;
  description: string;
}
