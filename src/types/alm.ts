export interface ALMCredentials {
  serverUrl: string;
  username: string;
  password: string;
}

export interface AuthSession {
  token: string;
  username: string;
  serverUrl: string;
  domain?: string;
  project?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  module?: string;
}

export interface ExecutionHistory {
  id: string;
  module: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  details?: string;
}

export interface TestExtractionParams {
  domain: string;
  project: string;
  folderPath: string;
  source: 'test_plan' | 'test_set';
  testSetIds: string;
  withAttachments: boolean;
}

export interface DefectExtractionParams {
  statusList: string[];
  priority: string;
  severity: string;
  category: string;
}

export interface TestTypeUpdateParams {
  testCaseIds: string;
  newTestType: string;
}

export interface EvidenceGeneratorParams {
  testSetId: string;
  runId: string;
}

export interface AttachmentDownloadParams {
  testSetIds: string;
}

export interface AccessProvisionParams {
  username: string;
  email: string;
  groups: string[];
}

export interface MaintenanceNotifyParams {
  fromDate: string;
  toDate: string;
  timeWindow: string;
  project: string;
  reason: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  logs?: ExecutionLog[];
  downloadUrl?: string;
}

export interface DashboardStats {
  connectionStatus: 'connected' | 'disconnected' | 'error';
  activeUser: string;
  activeProject: string;
  lastExecution: string;
  errorsLast24h: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
}
