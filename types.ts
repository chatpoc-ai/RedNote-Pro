export interface PostData {
  id: string;
  keyword: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  date: string;
  url: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ScrapeConfig {
  intervalHours: number;
  requestsPerBatch: number;
  itemsPerKeyword: number; // Added field for "50 articles" requirement
  minDelayMs: number;
  maxDelayMs: number;
  simulateProxy: boolean;
  simulateUserAgent: boolean;
}

export enum ScrapeStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COOLDOWN = 'COOLDOWN'
}