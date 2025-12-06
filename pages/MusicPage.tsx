
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PageProps, ViewMode } from '../types';

// Retro 1999 Style Database - 3 Categories
// ORDER CHANGED: Light First
const OST_DATABASE = [
  {
    id: 'LGT',
    label: 'RADIO // LIGHT',
    tracks: [
      { id: '1.1', title: 'Morning', artist: 'Clear', filename: '1.1Morning (Clear).mp3' },
      { id: '1.2', title: 'Morning', artist: 'Light Rain', filename: '1.2Morning · Light Rain.mp3' },
      { id: '1.3', title: 'Morning', artist: 'Heavy Rain', filename: '1.3Morning · Heavy Rain.mp3' },
      { id: '1.4', title: 'Dusk', artist: 'Clear', filename: '1.4Dusk (Clear).mp3' },
      { id: '1.5', title: 'Dusk', artist: 'Light Rain', filename: '1.5Dusk · Light Rain.mp3' },
      { id: '1.6', title: 'Nightfall', artist: 'Mystery', filename: '1.6Nightfall · Mystery.mp3' },
      { id: '1.7', title: 'Nightfall', artist: 'Light Rain', filename: '1.7Nightfall · Light Rain.mp3' },
      { id: '1.8', title: 'Nightfall', artist: 'Heavy Rain', filename: '1.8Nightfall · Heavy Rain.mp3' },
      { id: '1.9', title: 'Overcast', artist: 'Light Rain', filename: '1.9Overcast · Light Rain.mp3' },
      { id: '1.10', title: 'Overcast', artist: 'Heavy Rain', filename: '1.10Overcast · Heavy Rain.mp3' },
      { id: '1.11', title: 'Overcast', artist: 'Torrential', filename: '1.11Overcast · Torrential Rain.mp3' },
      { id: '1.12', title: 'Overcast', artist: 'Dense Fog', filename: '1.12Overcast · Dense Fog.mp3' },
      { id: '1.13', title: 'Overcast', artist: 'Light Snow', filename: '1.13Overcast · Light Snow.mp3' },
    ]
  },
  {
    id: 'OST',
    label: 'ARCHIVE // OST',
    tracks: [
      { 
        id: '2.1', 
        title: 'The Storm', 
        artist: 'Adam Gubman', 
        filename: 'ost_1.mp3' 
      },
      { 
        id: '2.2', 
        title: 'Satin Matin', 
        artist: 'Vertin', 
        filename: 'ost_2.mp3' 
      }
    ]
  },
  {
    id: 'PVT',
    label: 'CASSETTE // PERSONAL',
    tracks: [
      { 
        id: '3.1', 
        title: 'TEST AUDIO', 
        artist: 'SYSTEM CHECK', 
        // ENSURE: /public/music/test.mp3 exists for testing
        filename: 'test.mp3' 
      },
      { 
        id: '3.2', 
        title: 'My Favorite Song', 
        artist: 'Artist Name', 
        filename: 'fav_1.mp3' 
      }
    ]
  }
];

const MusicPage: React.FC<PageProps> = ({ viewMode }) => {
  // Flatten tracks for easy indexing
  const allTracks = useMemo(() => OST_DATABASE.flatMap(cat => cat.tracks), []);
  
  // --- STATE ---
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('LGT'); // Default to Light
  const [loopMode, setLoopMode] = useState<'playlist' | 'single'>('playlist');
  
  // Progress Bar State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // --- DEBUG STATE ---
  const [debugInfo, setDebugInfo] = useState({
      src: '',
      readyState: 0,
      error: null as string | null,
      httpStatus: 'CHECKING...' as string | number
  });

  const currentSong = allTracks[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- DIAGNOSTIC HELPERS ---
  const checkFileAccess = async (path: string) => {
      try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
              setDebugInfo(prev => ({ ...prev, httpStatus: response.status }));
          } else {
              setDebugInfo(prev => ({ ...prev, httpStatus: `${response.status} (MISSING)` }));
          }
      } catch (e) {
          setDebugInfo(prev => ({ ...prev, httpStatus: 'NET_ERR' }));
      }
  };

  // --- AUDIO ACTIONS ---

  const getTrackPath = (filename: string) => {
      // Encode URI component to handle spaces and special chars in filenames
      return `music/${encodeURIComponent(filename)}`;
  };

  const loadTrack = (index: number) => {
      if (!audioRef.current) return;
      
      const track = allTracks[index];
      const src = getTrackPath(track.filename);
      
      setIsLoading(true);
      setCurrentTrackIndex(index);
      setCurrentTime(0); // Reset time on new track
      
      setDebugInfo(prev => ({ ...prev, src: decodeURIComponent(src), error: null, httpStatus: 'CHECKING...' }));
      checkFileAccess(src);

      audioRef.current.src = src;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
          playPromise
            .then(() => { /* handled by onPlay */ })
            .catch(error => {
                console.warn("[Music] Auto-play prevented:", error);
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

  // --- EVENT HANDLERS ---

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onCanPlay = () => {
      setIsLoading(false);
      setDebugInfo(prev => ({ ...prev, error: null }));
  };
  
  const onError = (e: any) => {
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
      setDebugInfo(prev => ({ ...prev, error: msg }));
  };

  // Time Updates
  const onTimeUpdate = () => {
      if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
      }
  };

  const onLoadedMetadata = () => {
      if (audioRef.current) {
          setDuration(audioRef.current.duration);
      }
  };

  // Seek Handler
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !duration) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const newTime = pct * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
  };

  // Handle Track End based on Loop Mode
  const onEnded = () => {
      if (loopMode === 'playlist') {
          nextTrack();
      }
      // If loopMode is single, the <audio loop> attribute handles it automatically
  };

  // Initial Load
  useEffect(() => {
     if (audioRef.current && !audioRef.current.src) {
         const firstSrc = getTrackPath(allTracks[0].filename);
         audioRef.current.src = firstSrc;
         setDebugInfo(prev => ({ ...prev, src: decodeURIComponent(firstSrc) }));
         checkFileAccess(firstSrc);
     }
  }, []);

  // Periodic Debug Update
  useEffect(() => {
      const interval = setInterval(() => {
          if (audioRef.current) {
              setDebugInfo(prev => ({
                  ...prev,
                  readyState: audioRef.current!.readyState,
              }));
          }
      }, 500);
      return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative h-full w-full flex items-center justify-center animate-fade-in overflow-hidden bg-retro-paper">
      
      <audio 
        ref={audioRef}
        loop={loopMode === 'single'} 
        onPlay={onPlay}
        onPause={onPause}
        onCanPlay={onCanPlay}
        onEnded={onEnded}
        onError={onError}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        preload="auto"
      />

      {/* --- BACKGROUND DECORATION (The Vinyl) --- */}
      <div className={`
          absolute -top-[20vh] -right-[20vh] md:-top-[50vh] md:-right-[20vh] pointer-events-none transition-all duration-1000 ease-in-out z-0
          ${viewMode === ViewMode.MAIN ? 'opacity-100 scale-100' : 'opacity-10 scale-90 blur-sm'}
      `}>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vh] h-[110vh] md:w-[170vh] md:h-[170vh] rounded-full bg-retro-gray/5 border border-retro-black/5"></div>
           <div className={`
               relative w-[100vh] h-[100vh] md:w-[160vh] md:h-[160vh] rounded-full bg-[#080808] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[#1a1a1a]
               ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : 'transition-transform duration-700 ease-out'}
           `}>
               <div className="absolute inset-1 rounded-full opacity-30 bg-[repeating-radial-gradient(#222_0,#111_2px,#222_4px)]"></div>
               <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.05)_220deg,transparent_260deg)]"></div>
               <div className="absolute w-1/3 h-1/3 bg-retro-red rounded-full flex items-center justify-center shadow-inner border-[12px] border-[#080808]">
                   <div className="w-4 h-4 md:w-8 md:h-8 bg-white rounded-full shadow-md"></div>
                   <span className="absolute bottom-8 md:bottom-16 font-mono text-sm md:text-2xl text-retro-paper/90 tracking-widest font-bold">STEREO</span>
               </div>
           </div>
      </div>

      {/* --- VIEW: MAIN (Player Controls) --- */}
      <div className={`
          absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 flex flex-col justify-end p-8 md:p-12
          ${viewMode === ViewMode.MAIN ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}
      `}>
          
          {/* Loop Toggle Button - ABSOLUTE TOP LEFT OF MAIN VIEW CONTAINER */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
              <button 
                  onClick={toggleLoopMode}
                  className={`
                    group w-[12vmin] h-[12vmin] md:w-[6vmin] md:h-[6vmin] flex items-center justify-center border-2 transition-all rounded-sm bg-retro-paper/80 backdrop-blur-sm
                    ${loopMode === 'single' ? 'border-retro-gold text-retro-gold' : 'border-retro-gray/40 text-retro-ink/50 hover:border-retro-ink hover:text-retro-ink'}
                  `}
                  title={loopMode === 'single' ? "Single Loop" : "Playlist Loop"}
              >
                   {loopMode === 'single' ? (
                       <div className="relative">
                            <svg className="w-[6vmin] h-[6vmin] md:w-[3vmin] md:h-[3vmin]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[2.5vmin] md:text-[1.2vmin] font-bold bg-retro-paper rounded-full px-0.5 leading-none">1</span>
                       </div>
                   ) : (
                        <svg className="w-[6vmin] h-[6vmin] md:w-[3vmin] md:h-[3vmin]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                   )}
              </button>
          </div>

          <div className="w-full max-w-2xl flex flex-col gap-6">
              
              <div className="flex flex-col gap-6 relative">
                  
                  {/* Status Row */}
                  <div className="flex items-end justify-between pl-2">
                      <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-retro-green shadow-[0_0_8px_#22c55e]' : 'bg-retro-red'}`}></div>
                              <span className="font-mono text-xs tracking-[0.3em] text-retro-ink/60 uppercase">
                                  {isLoading ? 'LOADING...' : (isPlaying ? 'ACTIVE' : 'READY')}
                              </span>
                          </div>
                      </div>
                  </div>

                  {/* Big Playback Buttons */}
                  <div className="flex items-center gap-[5vmin] relative z-20">
                      <button onClick={prevTrack} className="group w-[10vmin] h-[10vmin] flex items-center justify-center rounded-full border-2 border-retro-gray/20 hover:border-retro-ink hover:bg-retro-ink transition-all">
                          <svg className="w-[4vmin] h-[4vmin] text-retro-ink group-hover:text-retro-paper" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                      </button>
                      
                      <button 
                          onClick={togglePlay}
                          className={`
                              w-[15vmin] h-[15vmin] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all
                              ${isPlaying ? 'bg-retro-gold text-retro-ink' : 'bg-retro-ink text-retro-paper'}
                              ${debugInfo.error ? 'animate-pulse bg-retro-red text-white' : ''}
                          `}
                      >
                          {isPlaying ? (
                              <svg className="w-[6vmin] h-[6vmin]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                          ) : (
                              <svg className="w-[6vmin] h-[6vmin] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          )}
                      </button>
                      
                      <button onClick={nextTrack} className="group w-[10vmin] h-[10vmin] flex items-center justify-center rounded-full border-2 border-retro-gray/20 hover:border-retro-ink hover:bg-retro-ink transition-all">
                           <svg className="w-[4vmin] h-[4vmin] text-retro-ink group-hover:text-retro-paper" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                      </button>
                  </div>

                  {/* MAIN VIEW PROGRESS BAR (Absolute Bottom, Minimal) */}
                  <div 
                        className="absolute -bottom-6 left-0 right-0 h-1 bg-retro-gray/20 cursor-pointer group hover:h-1.5 transition-all z-10"
                        onClick={handleProgressClick}
                   >
                        <div 
                            className="h-full bg-retro-ink transition-all duration-100 ease-linear relative"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-retro-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"></div>
                        </div>
                   </div>

              </div>

          </div>
      </div>


      {/* --- VIEW: CONFIG (FULL SCREEN INFO DASHBOARD) --- */}
      <div className={`
          absolute inset-0 bg-retro-paper/95 backdrop-blur-sm z-20 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          flex flex-col shadow-2xl overflow-hidden
          ${viewMode === ViewMode.CONFIG ? 'translate-y-0' : '-translate-y-full'}
      `}>
           
           {/* 1. FLOATING DIAGNOSTIC WIDGET (Top Right) */}
           <div className={`
                absolute top-[4vmin] right-[4vmin] z-50 transition-all duration-300
                ${isDbOpen ? 'opacity-0 pointer-events-none translate-x-10' : 'opacity-100 pointer-events-auto translate-x-0'}
           `}>
               <div className="bg-[#0a0a0a] border-2 border-[#333] p-2 shadow-lg font-mono text-xs w-[25vmin] min-w-[180px] overflow-hidden group hover:opacity-100 opacity-80 transition-opacity">
                   {/* Scanlines */}
                   <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20"></div>
                   
                   <div className="relative z-10 text-[#ffb74d] flex flex-col gap-1">
                       <div className="flex justify-between border-b border-[#333] pb-1 mb-1">
                           <span className="font-bold tracking-wider text-[1.2vmin]">SYS.LOG</span>
                           <span className={debugInfo.httpStatus === 200 ? "text-retro-green font-bold" : "text-retro-red font-bold animate-pulse"}>
                               {debugInfo.httpStatus}
                           </span>
                       </div>
                       <div className="text-[1vmin] flex flex-col gap-0.5">
                           <div className="truncate"><span className="text-gray-500">SRC:</span> {debugInfo.src || 'NULL'}</div>
                           <div><span className="text-gray-500">ST:</span> {debugInfo.readyState}</div>
                           <div><span className="text-gray-500">LOOP:</span> {loopMode.toUpperCase()}</div>
                           {debugInfo.error && (
                               <div className="text-retro-red font-bold animate-pulse">{debugInfo.error}</div>
                           )}
                       </div>
                   </div>
               </div>
           </div>

           {/* 2. MAIN INFO AREA (Full Screen, Left Aligned) */}
           <div className="relative w-full h-full flex items-center pl-[6vmin] border-l-4 border-retro-gold transition-all duration-500">
               <div className={`flex flex-col justify-center w-full transition-all duration-500 ${isDbOpen ? 'pr-[35%]' : 'pr-[6vmin]'}`}>
                   
                   <div className="font-mono text-xs text-retro-gold tracking-[0.5em] mb-6">AUDIO_LOG // {selectedCategory}</div>
                   
                   <div className="flex flex-col gap-4 mb-6">
                       <h1 className="text-[12vmin] md:text-[10vmin] font-serif font-bold text-retro-ink leading-[0.9] tracking-tight drop-shadow-sm break-words">
                           {currentSong.title}
                       </h1>
                       <h2 className="text-[5vmin] md:text-[4vmin] font-sans italic text-retro-gray tracking-widest">
                           {currentSong.artist}
                       </h2>
                   </div>
                   
                   {/* VISUALIZER BAR (REVERTED TO DECORATIVE) */}
                   <div className="w-full h-1 bg-retro-gray/20 mb-8 flex items-center gap-2 overflow-hidden">
                        {isLoading ? (
                            <div className="h-full w-full bg-retro-gold animate-[scan_1s_linear_infinite] origin-left"></div>
                        ) : (
                            <>
                                <div className="h-full w-1/3 bg-retro-gold/50"></div>
                                <div className="h-full flex-1 bg-retro-gray/10 repeating-linear-gradient-45"></div>
                            </>
                        )}
                   </div>

                   {/* Toggle Database Button */}
                   <button 
                       onClick={() => setIsDbOpen(!isDbOpen)}
                       className={`
                           font-mono font-bold text-sm px-8 py-4 border-2 transition-all flex items-center gap-3 self-start
                           ${isDbOpen ? 'bg-retro-gold text-retro-paper border-retro-gold' : 'bg-transparent text-retro-gold border-retro-gold hover:bg-retro-gold/10'}
                       `}
                   >
                       {isDbOpen ? '>> HIDE DATABASE' : '<< ACCESS DATABASE'}
                   </button>
               </div>
           </div>

           {/* 3. DATABASE SLIDE-IN PANEL (Absolute Right) */}
           <div className={`
                absolute top-0 right-0 bottom-0 w-[40%] min-w-[320px] bg-retro-paper border-l-2 border-dashed border-retro-gray/30 
                flex flex-col shadow-2xl z-40 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isDbOpen ? 'translate-x-0' : 'translate-x-full'}
           `}>
                <div className="p-[4vmin] h-full flex flex-col overflow-hidden">
                    <div className="font-mono text-[10px] text-retro-gray/60 tracking-widest mb-6 mt-[8vmin]">ARCHIVE // 1999</div>
                    
                    <div className="flex gap-4 h-full overflow-hidden pb-4">
                        {/* Category List */}
                        <div className="w-[30%] flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 pt-2">
                             {OST_DATABASE.map(cat => (
                                 <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`
                                        text-left font-mono text-xs py-4 px-2 border-l-2 transition-all
                                        ${selectedCategory === cat.id 
                                            ? 'border-retro-gold bg-retro-gold/10 text-retro-ink font-bold' 
                                            : 'border-retro-gray/20 text-retro-gray hover:border-retro-gray/50'}
                                    `}
                                 >
                                     <span className="opacity-50 block text-[9px] mb-1">{cat.id}</span>
                                     {cat.label.split('//')[1].trim()}
                                 </button>
                             ))}
                        </div>

                        {/* Track List - Optimized for Mobile Touch */}
                        <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pb-10 pr-1 touch-pan-y">
                            {selectedCategory ? (
                                OST_DATABASE.find(c => c.id === selectedCategory)?.tracks.map((track) => {
                                    const isCurrent = track.id === currentSong.id;
                                    return (
                                        <button
                                            key={track.id}
                                            onClick={() => playTrackById(track.id)}
                                            className={`
                                                group text-left font-mono text-xs p-4 border transition-all relative overflow-hidden shrink-0 active:scale-[0.98]
                                                ${isCurrent 
                                                    ? 'bg-retro-ink text-retro-gold border-retro-ink shadow-md' 
                                                    : 'bg-retro-paper-dark text-retro-ink border-retro-gray/20 hover:border-retro-gold'}
                                            `}
                                        >
                                            <div className="relative z-10 flex justify-between items-center">
                                                <div className="flex flex-col overflow-hidden mr-3 gap-1">
                                                     <span className="truncate font-bold text-sm leading-tight">{track.title}</span>
                                                     <span className="text-[10px] opacity-60 truncate">{track.artist}</span>
                                                </div>
                                                {isCurrent && <span className="animate-pulse text-xs">▶</span>}
                                            </div>
                                        </button>
                                    );
                                })
                            ) : null}
                        </div>
                    </div>
                </div>
           </div>

      </div>

    </div>
  );
};

export default MusicPage;
