import { useState, useEffect } from 'react';
import { MusicTrack } from '../types';

const MOCK_PLAYLIST: MusicTrack[] = [
  {
    id: 'mock_1',
    title: "Satin Matin",
    artist: "Vertin",
    filename: "mock_1.mp3"
  },
  {
    id: 'mock_2',
    title: "London Fog",
    artist: "Sonetto",
    filename: "mock_2.mp3"
  }
];

export const useMusicSessionMock = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100

  const currentTrack = MOCK_PLAYLIST[currentTrackIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MOCK_PLAYLIST.length) % MOCK_PLAYLIST.length);
    setProgress(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + 0.5; // Simulate progress
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return {
    isPlaying,
    currentTrack,
    progress,
    togglePlay,
    nextTrack,
    prevTrack
  };
};