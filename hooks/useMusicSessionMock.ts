import { useState, useEffect } from 'react';
import { MusicTrack } from '../types';

const MOCK_PLAYLIST: MusicTrack[] = [
  {
    title: "Satin Matin",
    artist: "Vertin",
    album: "The Storm",
    coverUrl: "https://picsum.photos/400/400?grayscale",
    duration: 184
  },
  {
    title: "London Fog",
    artist: "Sonetto",
    album: "1999 Archive",
    coverUrl: "https://picsum.photos/401/401?grayscale",
    duration: 210
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