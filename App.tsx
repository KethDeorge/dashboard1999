
import React, { useState, useEffect, useCallback, useRef } from 'react';
import InfoBar from './components/InfoBar';
import TimePage from './pages/TimePage';
import FocusPage from './pages/FocusPage';
import TasksPage from './pages/TasksPage';
import MusicPage from './pages/MusicPage';
import { PageId, ViewMode } from './types';
import { PAGES } from './constants';
import { useFocusTimer } from './hooks/useFocusTimer';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { useDeviceStatus } from './hooks/useDeviceStatus';

const App: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [verticalLevel, setVerticalLevel] = useState(1); // 0: Sleep, 1: Main, 2: Config
  const [isPortrait, setIsPortrait] = useState(false);
  
  // Global State Hooks
  const focusTimer = useFocusTimer();
  const musicPlayer = useMusicPlayer();
  const deviceStatus = useDeviceStatus();
  
  // Audio Refs for Global Alarm
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const touchStart = useRef<{ x: number, y: number } | null>(null);

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // --- GLOBAL ALARM LOGIC & PRIORITY ---
  useEffect(() => {
    let intervalId: number;

    if (focusTimer.isFinished) {
        // PRIORITY: If alarm triggers, pause music immediately
        if (musicPlayer.isPlaying) {
            musicPlayer.togglePlay();
        }

        // Initialize Audio Context on demand
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const playBeep = () => {
            const ctx = audioCtxRef.current!;
            if (ctx.state === 'suspended') ctx.resume();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Retro Sawtooth Wave for "Warning" sound
            osc.type = 'sawtooth'; 
            
            // Frequency Sweep (High to Low - like a siren chirp)
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        };

        playBeep();
        intervalId = window.setInterval(playBeep, 800);
    } else {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
        }
    }

    return () => {
        clearInterval(intervalId);
    };
  }, [focusTimer.isFinished]); // Removed musicPlayer dependency to avoid loops, explicit call inside


  // Horizontal Navigation (Left/Right)
  const navigateHorizontal = useCallback((direction: 'left' | 'right') => {
    setPageIndex((prev) => {
      if (direction === 'left') {
        return prev === 0 ? PAGES.length - 1 : prev - 1;
      } else {
        return prev === PAGES.length - 1 ? 0 : prev + 1;
      }
    });
  }, []);

  // Vertical Navigation (Up/Down)
  const navigateVertical = useCallback((direction: 'up' | 'down') => {
    setVerticalLevel((prev) => {
      if (direction === 'up') {
        return Math.min(prev + 1, 2);
      } else {
        return Math.max(prev - 1, 0);
      }
    });
  }, []);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          navigateVertical('up');
          break;
        case 'ArrowDown':
          navigateVertical('down');
          break;
        case 'ArrowLeft':
          navigateHorizontal('left');
          break;
        case 'ArrowRight':
          navigateHorizontal('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateHorizontal, navigateVertical]);


  // Touch Handler
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = touchStart.current.x - endX;
    const diffY = touchStart.current.y - endY;
    const SWIPE_THRESHOLD = 15; 
    
    let effectiveDiffX = diffX;
    let effectiveDiffY = diffY;

    if (isPortrait) {
        effectiveDiffX = diffY; 
        effectiveDiffY = -diffX;
    }

    if (Math.abs(effectiveDiffY) > Math.abs(effectiveDiffX)) {
        if (Math.abs(effectiveDiffY) > SWIPE_THRESHOLD) {
            if (effectiveDiffY > 0) navigateVertical('up'); 
            else navigateVertical('down');
        }
    } 
    else if (Math.abs(effectiveDiffX) > SWIPE_THRESHOLD) {
        if (effectiveDiffX > 0) navigateHorizontal('right');
        else navigateHorizontal('left');
    }
    
    touchStart.current = null;
  };

  const currentViewMode = verticalLevel === 2 ? ViewMode.CONFIG : ViewMode.MAIN;
  const isAsleep = verticalLevel === 0;

  const renderPage = () => {
    const props = { viewMode: currentViewMode, deviceStatus };
    
    switch (PAGES[pageIndex]) {
      case PageId.TIME: return <TimePage {...props} />;
      case PageId.FOCUS: return <FocusPage {...props} focusTimer={focusTimer} />;
      case PageId.TASKS: return <TasksPage {...props} />;
      // Pass the global music player to MusicPage
      case PageId.MUSIC: return <MusicPage {...props} musicPlayer={musicPlayer} />;
      default: return <TimePage {...props} />;
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black overflow-hidden font-sans select-none touch-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
    >
      {/* --- GLOBAL AUDIO ELEMENT (Hidden, Persistent) --- */}
      <audio 
        ref={musicPlayer.audioRef}
        loop={musicPlayer.loopMode === 'single'}
        preload="auto"
        {...musicPlayer.audioEvents}
      />

      {/* Texture Overlays */}
      <div className="noise-overlay"></div>
      <div className="scanlines"></div>

      {/* --- GLOBAL ALARM OVERLAY --- */}
      <div 
        className={`
            fixed inset-0 z-[999] bg-retro-red flex flex-col items-center justify-center overflow-hidden
            transition-opacity duration-300
            ${focusTimer.isFinished ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
          <div className={`w-full h-full flex flex-col items-center justify-center relative ${isPortrait ? 'rotate-90' : ''}`}>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none"></div>
              <div className="animate-pulse flex flex-col items-center text-retro-paper z-20">
                   <div className="w-24 h-24 border-4 border-retro-paper rounded-full flex items-center justify-center mb-6 animate-[spin_3s_linear_infinite]">
                        <div className="w-16 h-16 bg-retro-paper rounded-full opacity-20"></div>
                   </div>
                   <h1 className="font-serif font-bold text-4xl md:text-6xl tracking-widest text-center px-4 leading-tight shadow-black drop-shadow-md">
                       SEQUENCE<br/>COMPLETE
                   </h1>
                   <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          focusTimer.stopAlarm();
                      }}
                      className="mt-12 bg-retro-paper text-retro-red font-mono font-bold text-2xl px-12 py-6 border-[6px] border-retro-black/20 shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-none hover:bg-white transition-all tracking-[0.2em]"
                   >
                       TERMINATE
                   </button>
              </div>
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] animate-pulse pointer-events-none"></div>
          </div>
      </div>

      {/* Sleep Screen Overlay */}
      <div 
        className={`
            transition-all duration-1000 ease-in-out flex flex-col items-center justify-center overflow-hidden z-[100] bg-[#030303]
            ${isAsleep ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-500'}
            ${isPortrait 
                ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vh] h-[100vw] rotate-90 origin-center' 
                : 'absolute inset-0 w-full h-full'
            }
        `}
      >
          {/* ... (Sleep Screen Visuals omitted for brevity, same as before) ... */}
           {/* Reverse Rain Effect (Simulated via Upward Scanline) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#c5a059_10%,transparent_20%)] bg-[length:2px_150px] animate-[scan_2s_linear_infinite_reverse]" style={{ backgroundSize: '1px 150px' }}></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#c5a059_5%,transparent_10%)] bg-[length:1px_200px] animate-[scan_3s_linear_infinite_reverse] translate-x-10" style={{ backgroundSize: '1px 200px', animationDelay: '0.5s' }}></div>
          </div>

          {/* Central Motif: 1999 Diamond */}
          <div className="relative z-10 flex flex-col items-center gap-12">
              <div className="w-40 h-40 md:w-56 md:h-56 border border-retro-gold/20 rotate-45 flex items-center justify-center animate-pulse-slow relative transition-all duration-1000">
                   {/* Inner frames */}
                   <div className="w-[70%] h-[70%] border border-retro-gold/10 absolute inset-0 m-auto"></div>
                   <div className="w-[40%] h-[40%] border border-retro-gold/30 absolute inset-0 m-auto rotate-90"></div>
                   
                   {/* Center Glow */}
                   <div className="w-2 h-2 bg-retro-gold/80 rounded-full shadow-[0_0_20px_#c5a059] animate-ping opacity-50 absolute"></div>
                   <div className="w-3 h-3 bg-retro-gold rounded-full shadow-[0_0_10px_#c5a059]"></div>
              </div>
              
              {/* Typography */}
              <div className="flex flex-col items-center gap-4 text-retro-gold/80">
                  <h1 className="font-serif text-6xl md:text-8xl tracking-widest font-bold opacity-90 drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                    STASIS
                  </h1>
                  <div className="flex items-center gap-4 w-full opacity-60">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-retro-gold to-transparent"></div>
                      <span className="font-mono text-xs tracking-[0.5em] uppercase whitespace-nowrap">TEMPORARY SUSPENSION</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-retro-gold to-transparent"></div>
                  </div>
              </div>
          </div>

          {/* Footer Hint */}
          <div className="absolute bottom-16 font-mono text-[10px] text-retro-gray/40 tracking-[0.3em] animate-pulse flex flex-col items-center gap-2">
              <div className="w-[1px] h-8 bg-gradient-to-t from-retro-gray/50 to-transparent"></div>
              <span>▲ SWIPE UP TO WAKE</span>
          </div>
      </div>

      {/* Main App Container */}
      <div className={`
        relative bg-retro-paper flex flex-col transition-all duration-700
        ${isAsleep ? 'blur-md brightness-50 scale-90' : 'blur-0 brightness-100 scale-100'}
        ${isPortrait 
            ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vh] h-[100vw] rotate-90 origin-center' 
            : 'w-full h-full'
        }
      `}>
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-40 pointer-events-none"></div>
        
        {/* HUD Decorations */}
        <div className="absolute inset-0 pointer-events-none z-0 p-2 md:p-4">
            <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-retro-gold opacity-60"></div>
            <div className="absolute top-4 left-4 font-mono text-[9px] text-retro-gold/60 tracking-widest">UNIT-01<br/>SYNC.NET</div>
            <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-retro-gold opacity-60"></div>
            <div className="absolute top-4 right-4 font-mono text-[9px] text-retro-gold/60 tracking-widest text-right">SYS.VER.1.99<br/>SECURE</div>
            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-retro-gold opacity-60"></div>
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-retro-gold opacity-60"></div>
        </div>

        <InfoBar currentPage={PAGES[pageIndex]} deviceStatus={deviceStatus} />

        <main className="flex-1 relative overflow-hidden flex flex-col">
            <div className="flex-1 w-full h-full relative z-10 p-4 md:p-8 flex flex-col justify-center">
                {renderPage()}
            </div>
            
             {!isAsleep && (
                 <>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 pointer-events-none">
                        <div className={`w-12 h-1 rounded-full bg-retro-ink transition-all ${verticalLevel === 2 ? 'w-4 opacity-50' : 'w-12'}`}></div>
                    </div>
                    {verticalLevel === 2 && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20 pointer-events-none z-50">
                            <div className="w-12 h-1 rounded-full bg-retro-ink"></div>
                        </div>
                    )}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-retro-gray/20 rounded-full"></div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-retro-gray/20 rounded-full"></div>
                 </>
             )}
        </main>
      </div>

    </div>
  );
};

export default App;
