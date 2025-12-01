
import React from 'react';
import { useMusicSessionMock } from '../hooks/useMusicSessionMock';
import { PageProps, ViewMode } from '../types';

const MusicPage: React.FC<PageProps> = ({ viewMode }) => {
  const { isPlaying, currentTrack, progress, togglePlay, nextTrack, prevTrack } = useMusicSessionMock();

  return (
    <div className="relative h-full w-full flex items-center justify-center animate-fade-in overflow-hidden bg-retro-paper">
      
      {/* --- BACKGROUND DECORATION (The Vinyl) --- */}
      {/* Visible on ALL screens now, positioned absolute top-right */}
      <div className={`
          absolute -top-[20vh] -right-[20vh] md:-top-[50vh] md:-right-[20vh] pointer-events-none transition-all duration-1000 ease-in-out z-0
          ${viewMode === ViewMode.MAIN ? 'opacity-100 scale-100' : 'opacity-20 scale-90 blur-sm'}
      `}>
           {/* Turntable Mat/Shadow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vh] h-[110vh] md:w-[170vh] md:h-[170vh] rounded-full bg-retro-gray/5 border border-retro-black/5"></div>
           
           {/* The Record Object */}
           <div className={`
               relative w-[100vh] h-[100vh] md:w-[160vh] md:h-[160vh] rounded-full bg-[#080808] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[#1a1a1a]
               ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : 'transition-transform duration-700 ease-out'}
           `}>
               {/* Grooves Texture - CSS Radial Gradient */}
               <div className="absolute inset-1 rounded-full opacity-30 bg-[repeating-radial-gradient(#222_0,#111_2px,#222_4px)]"></div>
               {/* Shine Reflection */}
               <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.05)_220deg,transparent_260deg)]"></div>
               
               {/* Center Label */}
               <div className="absolute w-1/3 h-1/3 bg-retro-red rounded-full flex items-center justify-center shadow-inner border-[12px] border-[#080808]">
                   <div className="w-4 h-4 md:w-8 md:h-8 bg-white rounded-full shadow-md"></div>
                   <span className="absolute bottom-8 md:bottom-16 font-mono text-sm md:text-2xl text-retro-paper/90 tracking-widest font-bold">STEREO</span>
               </div>
           </div>
      </div>

      {/* --- VIEW: MAIN (Minimalist Player Controls) --- */}
      <div className={`
          absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 flex flex-col justify-end p-8 md:p-12
          ${viewMode === ViewMode.MAIN ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}
      `}>
          <div className="w-full max-w-2xl flex flex-col gap-8">
              
              {/* Controls Container */}
              <div className="flex flex-col gap-6">
                  {/* Status Text */}
                  <div className="flex items-center gap-3 pl-2">
                      <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-retro-green shadow-[0_0_8px_#22c55e]' : 'bg-retro-red'}`}></div>
                      <span className="font-mono text-xs tracking-[0.3em] text-retro-ink/60 uppercase">
                          {isPlaying ? 'PLAYBACK ACTIVE' : 'READY'}
                      </span>
                  </div>

                  {/* Big Buttons */}
                  <div className="flex items-center gap-6 md:gap-10">
                      <button onClick={prevTrack} className="group w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-2 border-retro-gray/20 hover:border-retro-ink hover:bg-retro-ink transition-all">
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-retro-ink group-hover:text-retro-paper transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                      </button>
                      
                      <button 
                          onClick={togglePlay}
                          className="w-24 h-24 md:w-32 md:h-32 bg-retro-ink text-retro-paper rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all active:shadow-none"
                      >
                          {isPlaying ? (
                              <svg className="w-10 h-10 md:w-14 md:h-14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                          ) : (
                              <svg className="w-10 h-10 md:w-14 md:h-14 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          )}
                      </button>

                      <button onClick={nextTrack} className="group w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-2 border-retro-gray/20 hover:border-retro-ink hover:bg-retro-ink transition-all">
                           <svg className="w-6 h-6 md:w-8 md:h-8 text-retro-ink group-hover:text-retro-paper transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                      </button>
                  </div>

                  {/* Volume Slider Concept */}
                  <div className="flex flex-col gap-2 mt-4 max-w-sm pl-2">
                      <div className="flex justify-between font-mono text-[10px] text-retro-gray tracking-widest">
                          <span>GAIN</span>
                          <span>MASTER</span>
                      </div>
                      <div className="w-full h-1 bg-retro-gray/20 relative rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-retro-ink w-[70%]"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>


      {/* --- VIEW: CONFIG (Typography Overlay) --- */}
      <div className={`
          absolute inset-0 bg-retro-paper/95 backdrop-blur-sm z-20 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          flex flex-col p-8 md:p-16 shadow-2xl
          ${viewMode === ViewMode.CONFIG ? 'translate-y-0' : '-translate-y-full'}
      `}>
           <div className="w-full h-full border-l-4 border-retro-gold pl-8 flex flex-col justify-center">
               <div className="font-mono text-xs text-retro-gold tracking-[0.5em] mb-4">TRACK INFO</div>
               
               <h1 className="text-5xl md:text-8xl font-serif font-bold text-retro-ink leading-[0.9] tracking-tight mb-2">
                   {currentTrack.title}
               </h1>
               
               <h2 className="text-2xl md:text-4xl font-sans italic text-retro-gray tracking-widest mb-8">
                   {currentTrack.artist}
               </h2>

               <div className="w-24 h-1 bg-retro-red mb-8"></div>

               <div className="flex flex-col gap-1 font-mono text-xs text-retro-gray/60">
                    <span>ALBUM: {currentTrack.album.toUpperCase()}</span>
                    <span>YEAR: 1999</span>
                    <span>FORMAT: DIGITAL REMASTER</span>
               </div>
               
               {/* Progress bar for Config View */}
               <div className="w-full max-w-md mt-12 flex items-center gap-4 font-mono text-xs text-retro-ink">
                    <span>0:00</span>
                    <div className="flex-1 h-[2px] bg-retro-gray/20">
                        <div className="h-full bg-retro-ink" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>3:45</span>
               </div>
           </div>
      </div>

    </div>
  );
};

export default MusicPage;
