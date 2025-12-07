
import { useState, useRef, useEffect, useMemo } from 'react';
import { OST_DATABASE } from '../constants';
import { MusicTrack } from '../types';

export const useMusicPlayer = () => {
  // Flatten tracks for easy indexing
  const allTracks = useMemo(() => OST_DATABASE.flatMap(cat => cat.tracks), []);
  
  // --- STATE ---
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loopMode, setLoopMode] = useState<'playlist' | 'single'>('playlist');
  
  // Progress State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Debug State
  const [debugInfo, setDebugInfo] = useState({
      src: '',
      readyState: 0,
      error: null as string | null,
      httpStatus: 'WAITING' as string | number // Simplified status
  });

  const currentSong = allTracks[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- ACTIONS ---

  const getTrackPath = (filename: string) => {
      // Direct path mapping. In a packaged app, relative paths usually work relative to the index.html
      // encodeURIComponent helps with special characters, but underscores are safe.
      return `music/${filename}`;
  };

  // Removed checkFileAccess (fetch) to avoid CORS/file-protocol issues in packaged apps.
  // We now rely solely on the Audio element's onError event.

  const loadTrack = (index: number) => {
      if (!audioRef.current) return;
      
      const track = allTracks[index];
      const src = getTrackPath(track.filename);
      
      setIsLoading(true);
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      
      // Update Debug Info
      setDebugInfo(prev => ({ 
          ...prev, 
          src: src, 
          error: null, 
          httpStatus: 'LOADING...' 
      }));

      audioRef.current.src = src;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
          playPromise
            .then(() => { 
                // Play started successfully
                setDebugInfo(prev => ({ ...prev, httpStatus: 'PLAYING' }));
            })
            .catch(error => {
                console.warn("[Music] Auto-play prevented or aborted:", error);
                // Don't set error here immediately, let onError handle actual load failures.
                // This catch often triggers just because the user hasn't interacted with the page yet.
                setDebugInfo(prev => ({ ...prev, httpStatus: 'AUTOPLAY_BLOCK' }));
            });
      }
  };

  const togglePlay = () => {
      if (!audioRef.current) return;

      if (debugInfo.error) {
          loadTrack(currentTrackIndex);
          return;
      }

      if (audioRef.current.paused) {
          audioRef.current.play().catch(e => {
              // If failed to play, check if it's because source is empty
              if (!audioRef.current?.currentSrc) {
                  loadTrack(currentTrackIndex);
              }
          });
      } else {
          audioRef.current.pause();
      }
  };

  const toggleLoopMode = () => {
      setLoopMode(prev => prev === 'playlist' ? 'single' : 'playlist');
  };

  const nextTrack = () => {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= allTracks.length) nextIndex = 0;
      loadTrack(nextIndex);
  };

  const prevTrack = () => {
      let prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) prevIndex = allTracks.length - 1;
      loadTrack(prevIndex);
  };

  const playTrackById = (trackId: string) => {
      const idx = allTracks.findIndex(t => t.id === trackId);
      if (idx !== -1) loadTrack(idx);
  };

  const seek = (time: number) => {
      if (audioRef.current) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
      }
  };

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
        // Just set the source, don't play yet
        const firstSrc = getTrackPath(allTracks[0].filename);
        audioRef.current.src = firstSrc;
        setDebugInfo(prev => ({ ...prev, src: firstSrc, httpStatus: 'READY' }));
    }
 }, []);

  // --- EVENTS ---
  const audioEvents = {
    onPlay: () => {
        setIsPlaying(true);
        setDebugInfo(prev => ({ ...prev, httpStatus: 'PLAYING' }));
    },
    onPause: () => {
        setIsPlaying(false);
        setDebugInfo(prev => ({ ...prev, httpStatus: 'PAUSED' }));
    },
    onCanPlay: () => {
        setIsLoading(false);
        setDebugInfo(prev => ({ ...prev, error: null, httpStatus: 'BUFFERED' }));
    },
    onEnded: () => {
        if (loopMode === 'playlist') {
            nextTrack();
        }
    },
    onError: (e: any) => {
        setIsLoading(false);
        setIsPlaying(false);
        const err = e.target.error;
        let msg = "UNKNOWN";
        if (err) {
            if (err.code === 4) msg = "ERR:4 (NOT_FOUND)";
            if (err.code === 3) msg = "ERR:3 (DECODE)";
            if (err.code === 2) msg = "ERR:2 (NETWORK)";
            if (err.code === 1) msg = "ERR:1 (ABORTED)";
        }
        console.error(`[Music Error] ${msg} for ${audioRef.current?.src}`);
        setDebugInfo(prev => ({ ...prev, error: msg, httpStatus: 'ERROR' }));
    },
    onTimeUpdate: () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    },
    onLoadedMetadata: () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    }
  };

  return {
    currentSong,
    isPlaying,
    isLoading,
    loopMode,
    currentTime,
    duration,
    debugInfo,
    audioRef,
    togglePlay,
    toggleLoopMode,
    nextTrack,
    prevTrack,
    playTrackById,
    seek,
    audioEvents
  };
};
