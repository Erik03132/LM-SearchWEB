// Типы для приложения мониторинга веб-сайтов

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface Chunk {
  id: string;
  content: string;
  checksum: string;
  position: number;
}

export interface MonitoredUrl {
  id: string;
  url: string;
  userId: string;
  createdAt: Date;
  lastChecked: Date | null;
  status: 'pending' | 'indexed' | 'changed' | 'error';
  chunks: Chunk[];
  title: string;
  errorMessage?: string;
}

export interface ChangeRecord {
  id: string;
  urlId: string;
  url: string;
  userId: string;
  detectedAt: Date;
  changes: ChunkChange[];
  notified: boolean;
}

export interface ChunkChange {
  chunkId: string;
  oldContent: string;
  newContent: string;
  oldChecksum: string;
  newChecksum: string;
  position: number;
  changeType: 'modified' | 'added' | 'removed';
}

export interface LogEntry {
  id: string;
  userId: string;
  action: 'index' | 'monitor' | 'change_detected' | 'notification_sent' | 'error';
  urlId?: string;
  url?: string;
  message: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export interface NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  email?: string;
  webhookEnabled: boolean;
  webhookUrl?: string;
}

export interface MonitoringSchedule {
  userId: string;
  intervalMinutes: number;
  lastRun: Date | null;
  enabled: boolean;
}

export interface AppState {
  user: User | null;
  urls: MonitoredUrl[];
  changes: ChangeRecord[];
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
}
