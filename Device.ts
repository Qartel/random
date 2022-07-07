import mongoose from "mongoose";

export interface IDevice extends mongoose.Document {
  SalesOrder: string;
  MACAddress: string;
  SerialNumber: string;
  Category: string;
  Type: string;
  ConfigurationKey: string;
  HostName: string;
  ManagementIP: string;
  InterfaceId: string;
  InterfaceIP: string;
  InterfaceName: string;
  InterfaceDescription: string;
  InterfaceCategory: string;
  LoopbackIP: string;
  Make: string;
  Model: string;
  DownloadSpeedMbps: number;
  UploadSpeedMbps: number;
  Location: string;
  Latitude: number;
  Longitude: number;
  Address: string;
  Active: boolean;
  StabilityProfile: string;
  DownloadSpeedProfile: string;
  UploadSpeedProfile: string;
  AvailabilityProfile: string;
  Latency: string;
  PacketLoss: string;
  UtilizationUp: string;
  UtilizationDown: string;
  CustomerName: string;
  Site: string;
  CustomerId: string;
  SiteId: string;
  Suburb: string;
  ServiceDetailsId: string;
  ServiceDetailsName: string;
  ServiceDetailsCategory: string;
  ServiceDetailsActivationDate: Date;
  ServiceDetailsCurrentStatus: string;
  ServiceDetailsCurrentStatusApplyDate: Date;
  ServiceDetailsConfigurationDate: Date;
  Scenario: String;
}

const DeviceSchema = new mongoose.Schema<IDevice>({
  SalesOrder: { type: String },
  MACAddress: { type: String },
  SerialNumber: { type: String },
  HostName: { type: String },
  Category: { type: String },
  Type: { type: String },
  ConfigurationKey: { type: String },
  ManagementIP: { type: String },
  InterfaceId: { type: String },
  InterfaceIP: { type: String },
  InterfaceDescription: { type: String },
  InterfaceName: { type: String },
  InterfaceCategory: { type: String },
  LoopbackIP: { type: String },
  Make: { type: String },
  Model: { type: String },
  DownloadSpeedMbps: { type: String },
  UploadSpeedMbps: { type: String },
  Location: { type: String },
  Latitude: { type: Number },
  Longitude: { type: Number },
  Address: { type: String },
  Active: { type: Boolean, default: true },
  StabilityProfile: { type: String },
  DownloadSpeedProfile: { type: String },
  UploadSpeedProfile: { type: String },
  AvailabilityProfile: { type: String },
  Latency: { type: String },
  PacketLoss: { type: String },
  UtilizationUp: { type: String },
  UtilizationDown: { type: String },
  CustomerName: { type: String },
  Site: { type: String },
  CustomerId: { type: String },
  SiteId: { type: String },
  Suburb: { type: String },
  ServiceDetailsId: { type: String },
  ServiceDetailsName: { type: String },
  ServiceDetailsCategory: { type: Date },
  ServiceDetailsActivationDate: { type: Date },
  ServiceDetailsCurrentStatus: { type: String },
  ServiceDetailsCurrentStatusApplyDate: { type: Date },
  ServiceDetailsConfigurationDate: { type: Date },
  Scenario: { type: String },
});

export default mongoose.model<IDevice>("Device", DeviceSchema);
