
import React from 'react';
import { TimerStatus, PageProps, ViewMode } from '../types';

const FocusPage: React.FC<PageProps> = ({ viewMode, focusTimer }) => {
  // If focusTimer is not provided (e.g., safeguard), we return null or basic UI
  if (!focusTimer) return null;

  const { status, timeLeft, initialDuration, startTimer, pauseTimer, resetTimer, adjustTime, setPreset } = focusTimer;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center animate-fade-in p-[2vmin] overflow-hidden">
      
      {/* Container Frame */}
      <div className="relative w-full h-full bg-retro-paper-dark border-4 border-retro-brown shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden flex flex-col">
        
        {/* Corner Screws */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-retro-gray/40 border border-retro-black/20 shadow-inner z-30 flex items-center justify-center"><div className="w-1.5 h-[1px] bg-retro-black/40 rotate-45"></div></div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-retro-gray/40 border border-retro-black/20 shadow-inner z-30 flex items-center justify-center"><div className="w-1.5 h-[1px] bg-retro-black/40 rotate-12"></div></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-retro-gray/40 border border-retro-black/20 shadow-inner z-30 flex items-center justify-center"><div className="w-1.5 h-[1px] bg-retro-black/40 -rotate-45"></div></div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-retro-gray/40 border border-retro-black/20 shadow-inner z-30 flex items-center justify-center"><div className="w-1.5 h-[1px] bg-retro-black/40 rotate-90"></div></div>

        {/* --- VIEW: MAIN (Timer Only) --- */}
        <div className={`
            absolute inset-0 transition-transform duration-500 ease-in-out flex flex-row
            ${viewMode === ViewMode.MAIN ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-50 pointer-events-none'}
        `}>
             {/* Timer Display Area (Left) */}
             <div className="flex-[3] bg-[#0c0a00] relative flex flex-col items-center justify-center border-r-4 border-retro-brown overflow-hidden">
                {/* Glare & Grid - Enhanced */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.1)_1px,transparent_1px)] bg-[length:40px_40px] opacity-30 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,183,77,0.05),transparent_80%)] pointer-events-none"></div>

                {/* Main Digits - Responsive text using vmin */}
                <div className="font-mono text-[28vmin] leading-none font-bold text-[#ffb74d] drop-shadow-[0_0_15px_rgba(255,183,77,0.3)] tracking-tighter select-none z-10 tabular-nums transition-colors duration-300 relative">
                    {/* Ghost digits for aesthetics */}
                    <span className="absolute inset-0 text-[#2a2510] -z-10 blur-[1px]">88:88</span>
                    {formatTime(timeLeft)}
                </div>

                <div className="absolute bottom-[5vmin] font-mono text-xs text-[#ffb74d]/60 tracking-[0.5em] animate-pulse">
                    {status === TimerStatus.RUNNING ? '/// SEQUENCE ENGAGED ///' : '/// STANDBY ///'}
                </div>
                
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 w-full h-2 bg-retro-gold/20 flex">
                     {[...Array(20)].map((_, i) => (
                         <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-retro-gold/10' : 'bg-transparent'}`}></div>
                     ))}
                </div>
             </div>

             {/* Main Action Area (Right) */}
             <div className="flex-[2] bg-retro-paper flex items-center justify-center p-[4vmin] bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] relative">
                {/* Hazard Stripes Background on Container */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-retro-ink opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-retro-ink opacity-20"></div>

                {status === TimerStatus.RUNNING ? (
                     <button 
                        onClick={pauseTimer}
                        className="w-full h-full max-h-[40vmin] bg-retro-brown text-retro-paper border-b-[1.5vmin] border-retro-black/30 rounded-sm text-[5vmin] font-serif font-bold tracking-[0.2em] shadow-xl active:border-b-0 active:translate-y-3 transition-all hover:bg-retro-ink flex items-center justify-center overflow-hidden relative"
                     >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
                        <span className="z-10">STOP</span>
                     </button>
                 ) : (
                    <button 
                        onClick={startTimer}
                        className="w-full h-full max-h-[40vmin] bg-retro-green text-retro-paper border-b-[1.5vmin] border-retro-black/30 rounded-sm text-[5vmin] font-serif font-bold tracking-[0.2em] shadow-xl active:border-b-0 active:translate-y-3 transition-all hover:bg-retro-green-light flex items-center justify-center overflow-hidden relative"
                     >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
                        <span className="z-10">START</span>
                     </button>
                 )}
             </div>
        </div>

        {/* --- VIEW: CONFIG (Settings) --- */}
        <div className={`
            absolute inset-0 bg-retro-paper transition-transform duration-500 ease-in-out p-[5vmin] flex flex-col
            ${viewMode === ViewMode.CONFIG ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-50 pointer-events-none'}
        `}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-30 pointer-events-none"></div>
            
            <div className="z-10 h-full flex flex-col justify-center">
                <div className="border-b-2 border-retro-gold pb-4 mb-[4vmin] flex justify-between items-end">
                    <div>
                        <h2 className="text-[4vmin] font-serif font-bold text-retro-ink tracking-widest">CALIBRATION</h2>
                        <span className="font-mono text-[2.5vmin] font-bold text-retro-ink tracking-tight block mt-1">
                            TARGET: {Math.floor(initialDuration / 60)} MIN
                        </span>
                    </div>
                    <div className="flex flex-col items-end mb-1">
                        <span className="font-mono text-[1.5vmin] text-retro-red font-bold tracking-widest border border-retro-red px-2 py-1 bg-retro-red/10 animate-pulse shadow-[0_0_8px_rgba(143,51,51,0.3)]">
                            ⚠ CAUTION: PAUSE BEFORE ADJUSTING
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-[4vmin] h-full max-h-[40vmin]">
                    {/* Left Column: Increments */}
                    <div className="flex flex-col gap-[2vmin]">
                        <div className="flex gap-[2vmin] flex-1">
                            <button 
                                onClick={() => adjustTime(-5)}
                                className="flex-1 bg-retro-paper-dark border-2 border-retro-gray/30 hover:border-retro-ink font-mono text-[2.5vmin] font-bold active:bg-retro-gray/20 transition-all flex flex-col items-center justify-center shadow-sm"
                            >
                                -5 MIN
                            </button>
                            <button 
                                onClick={() => adjustTime(5)}
                                className="flex-1 bg-retro-paper-dark border-2 border-retro-gray/30 hover:border-retro-ink font-mono text-[2.5vmin] font-bold active:bg-retro-gray/20 transition-all flex flex-col items-center justify-center shadow-sm"
                            >
                                +5 MIN
                            </button>
                        </div>
                        <button 
                            onClick={() => setPreset(25)}
                            className="h-[10vmin] bg-retro-green/10 border-2 border-retro-green text-retro-green-light hover:bg-retro-green hover:text-white font-mono font-bold text-[2.5vmin] tracking-widest uppercase transition-all flex items-center justify-center shadow-sm"
                        >
                            PROTOCOL 25
                        </button>
                    </div>

                    {/* Right Column: Reset */}
                    <button 
                        onClick={resetTimer}
                        className="h-full bg-retro-red/5 border-2 border-retro-red/50 hover:bg-retro-red hover:text-white group transition-all flex flex-col items-center justify-center gap-[2vmin] relative overflow-hidden"
                    >
                         {/* Subtle stripes on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px] transition-opacity"></div>

                        <div className="w-[8vmin] h-[8vmin] rounded-full border-4 border-retro-red group-hover:border-white flex items-center justify-center shadow-inner z-10">
                            <div className="w-[4vmin] h-[4vmin] bg-retro-red group-hover:bg-white rounded-full"></div>
                        </div>
                        <span className="font-serif font-bold tracking-[0.2em] text-retro-red group-hover:text-white z-10 text-[2.5vmin]">SYSTEM RESET</span>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FocusPage;
