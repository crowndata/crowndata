export interface InfoData {
  dataName: string;
  timestamp?: string;
  startTime?: string;
  endTime?: string;
  robotEmbodiment?: string;
  robotSerialNumber?: string;
  videoSamplingRate?: number;
  armSamplingRate?: number;
  sensorSamplingRate?: number;
  operatorName?: string;
  taskDescription?: string;
  subtaskDescription?: string;
  taskState?: string;
  subtaskState?: string;
  dataLength?: number;
  durationInSeconds?: string;
  cameras?: string[];
  joints?: string[];
  dataSource?: string;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
}
