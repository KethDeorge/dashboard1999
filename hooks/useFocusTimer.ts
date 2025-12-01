

import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerStatus } from '../types';
import { DEFAULT_FOCUS_TIME, DEFAULT_BREAK_TIME } from '../constants';

export const useFocusTimer = () => {
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem('deskboard_focus_duration');
    return saved ? parseInt(saved, 10) : DEFAULT_FOCUS_TIME;
  });
  const [initialDuration, setInitialDuration] = useState<number>(() => {
    const saved = localStorage.getItem('deskboard_focus_duration');
    return saved ? parseInt(saved, 10) : DEFAULT_FOCUS_TIME;
  });
  
  // New State for Alarm
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('deskboard_focus_duration', initialDuration.toString());
  }, [initialDuration]);

  useEffect(() => {
    if (status === TimerStatus.RUNNING || status === TimerStatus.BREAK) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            // Timer finished
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus(TimerStatus.IDLE);
            setIsFinished(true); // Trigger Alarm
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const startTimer = useCallback(() => {
    setStatus(TimerStatus.RUNNING);
    setIsFinished(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setStatus(TimerStatus.PAUSED);
  }, []);

  const resetTimer = useCallback(() => {
    setStatus(TimerStatus.IDLE);
    setTimeLeft(initialDuration);
    setIsFinished(false);
  }, [initialDuration]);

  const adjustTime = useCallback((minutes: number) => {
    if (status === TimerStatus.RUNNING) return;
    
    setInitialDuration((prev) => {
      const newVal = Math.max(60, prev + minutes * 60);
      setTimeLeft(newVal);
      return newVal;
    });
  }, [status]);

  const setPreset = useCallback((minutes: number) => {
    setStatus(TimerStatus.IDLE);
    const duration = minutes * 60;
    setInitialDuration(duration);
    setTimeLeft(duration);
    setIsFinished(false);
  }, []);

  const stopAlarm = useCallback(() => {
      setIsFinished(false);
      // Reset timer automatically to initial duration after acknowledging alarm
      setTimeLeft(initialDuration);
  }, [initialDuration]);

  return {
    status,
    timeLeft,
    initialDuration,
    isFinished,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTime,
    setPreset,
    stopAlarm
  };
};