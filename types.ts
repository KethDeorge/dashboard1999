import React from 'react';

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
  focusTimer?: FocusTimerHook;
  musicPlayer?: MusicPlayerHook;
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
  id: string;
  title: string;
  artist: string;
  filename: string;
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

export interface MusicPlayerHook {
  currentSong: MusicTrack;
  isPlaying: boolean;
  isLoading: boolean;
  loopMode: 'playlist' | 'single';
  currentTime: number;
  duration: number;
  debugInfo: {
      src: string;
      readyState: number;
      error: string | null;
      httpStatus: string | number;
  };
  audioRef: React.RefObject<HTMLAudioElement>;
  togglePlay: () => void;
  toggleLoopMode: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  playTrackById: (trackId: string) => void;
  seek: (time: number) => void;
  // Event handlers to spread onto the audio element
  audioEvents: {
      onPlay: () => void;
      onPause: () => void;
      onCanPlay: () => void;
      onEnded: () => void;
      onError: (e: any) => void;
      onTimeUpdate: () => void;
      onLoadedMetadata: () => void;
  };
}