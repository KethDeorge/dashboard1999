

export enum PageId {
  TIME = 'TIME',
  FOCUS = 'FOCUS',
  TASKS = 'TASKS',
  MUSIC = 'MUSIC'
}

export enum ViewMode {
  MAIN = 'MAIN',
  CONFIG = 'CONFIG'
}

export enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  BREAK = 'break'
}

export interface PageProps {
  viewMode: ViewMode;
  // Optional: Pass timer data to pages that need it
  focusTimer?: FocusTimerHook;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number; // in seconds
}

// Define the return type of the hook so we can pass it around
export interface FocusTimerHook {
  status: TimerStatus;
  timeLeft: number;
  initialDuration: number;
  isFinished: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  adjustTime: (minutes: number) => void;
  setPreset: (minutes: number) => void;
  stopAlarm: () => void;
}