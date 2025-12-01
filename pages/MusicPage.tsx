
import React, { useState } from 'react';
import { useMusicSessionMock } from '../hooks/useMusicSessionMock';
import { PageProps, ViewMode } from '../types';

// Retro 1999 Style Database
const OST_DATABASE = [
  {
    id: '1',
    label: 'OST VOL.1 // THE STORM',
    tracks: [
      { id: '1.1', title: 'Start of the End', artist: 'Adam Gubman', songId: '1212060567' },
      { id: '1.2', title: 'Satin Matin', artist: 'Adam Gubman', songId: '2057926210' },
      { id: '1.3', title: 'London Fog', artist: 'Symbion Project', songId: '2057926214' }
    ]
  },
  {
    id: '2',
    label: 'OST VOL.2 // FOUNDATION',
    tracks: [
      { id: '2.1', title: 'Unexpected Storm', artist: 'Adam Gubman', songId: '2081504443' },
      { id: '2.2', title: 'Regulus', artist: 'Adam Gubman', songId: '2081504447' },
      { id: '2.3', title: 'Sonetto', artist: 'Adam Gubman', songId: '2081504448' }
    ]
  }
];

const MusicPage: React.FC<PageProps> = ({ viewMode }) => {
  const { isPlaying, togglePlay, nextTrack, prevTrack } = useMusicSessionMock();
  
  // Real Player State
  const [currentSong, setCurrentSong] = useState(OST_DATABASE[0].tracks[0]);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full flex items-center justify-center animate-fade-in overflow-hidden bg-retro-paper">
      
      {/* --- BACKGROUND DECORATION (The Vinyl) --- */}
      <div className={`
          absolute -top-[20vh] -right-[20vh] md:-top-[50vh] md:-right-[20vh] pointer-events-none transition-all duration-1000 ease-in-out z-0
          ${viewMode === ViewMode.MAIN ? 'opacity-100 scale-100' : 'opacity-10 scale-90 blur-sm'}
      `}>
           {/* Turntable Mat/Shadow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vh] h-[110vh] md:w-[170vh] md:h-[170vh] rounded-full bg-retro-gray/5 border border-retro-black/5"></div>
           
           {/* The Record Object */}
           <div className={`
               relative w-[100vh] h-[100vh] md:w-[160vh] md:h-[160vh] rounded-full bg-[#080808] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[#1a1a1a]
               ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : 'transition-transform duration-700 ease-out'}
           `}>
               {/* Grooves */}
               <div className="absolute inset-1 rounded-full opacity-30 bg-[repeating-radial-gradient(#222_0,#111_2px,#222_4px)]"></div>
               {/* Shine */}
               <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.05)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.05)_220deg,transparent_260deg)]"></div>
               
               {/* Center Label */}
               <div className="absolute w-1/3 h-1/3 bg-retro-red rounded-full flex items-center justify-center shadow-inner border-[12px] border-[#080808]">
                   <div className="w-4 h-4 md:w-8 md:h-8 bg-white rounded-full shadow-md"></div>
                   <span className="absolute bottom-8 md:bottom-16 font-mono text-sm md:text-2xl text-retro-paper/90 tracking-widest font-bold">STEREO</span>
               </div>
           </div>
      </div>

      {/* --- VIEW: MAIN (Minimalist Player Controls - Simulated) --- */}
      <div className={`
          absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-10 flex flex-col justify-end p-8 md:p-12
          ${viewMode === ViewMode.MAIN ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}
      `}>
          <div className="w-full max-w-2xl flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                  {/* Status Text */}
                  <div className="flex items-center gap-3 pl-2">
                      <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-retro-green shadow-[0_0_8px_#22c55e]' : 'bg-retro-red'}`}></div>
                      <span className="font-mono text-xs tracking-[0.3em] text-retro-ink/60 uppercase">
                          {isPlaying ? 'PLAYBACK ACTIVE' : 'READY'}
                      </span>
                  </div>

                  {/* Big Buttons - Responsive sizing using vmin/percentage */}
                  <div className="flex items-center gap-[5vmin]">
                      <button onClick={prevTrack} className="group w-[10vmin] h-[10vmin] flex items-center justify-center rounded-full border-2 border-retro-gray/20 hover:border-retro-ink hover:bg-retro-ink transition-all">
                          <svg className="w-[4vmin] h-[4vmin] text-retro-ink group-hover:text-retro-paper transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                      </button>
                      <button 
                          onClick={togglePlay}
                          className="w-[15vmin] h-[15vmin] bg-retro-ink text-retro-paper rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all active:shadow-none"
                      >
                          {isPlaying ? (
                              <svg className="w-[6vmin] h-[6vmin]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                          ) : (
                              <svg className="w-[6vmin] h-[6vmin] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          )}
                      </button>
                      <button onClick={nextTrack} className="group w-[10vmin] h-[10vmin] flex items-center justify-center rounded-full border-2 border-retro-gray/20 hover:border-retro-ink hover:bg-retro-ink transition-all">
                           <svg className="w-[4vmin] h-[4vmin] text-retro-ink group-hover:text-retro-paper transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                      </button>
                  </div>
              </div>
          </div>
      </div>


      {/* --- VIEW: CONFIG (Database & Info) --- */}
      <div className={`
          absolute inset-0 bg-retro-paper/95 backdrop-blur-sm z-20 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          flex flex-col p-[5vmin] shadow-2xl
          ${viewMode === ViewMode.CONFIG ? 'translate-y-0' : '-translate-y-full'}
      `}>
           <div className="w-full h-full border-l-4 border-retro-gold pl-[3vmin] flex gap-[3vmin] overflow-hidden">
               
               {/* Left Column: Info & Visualizer */}
               <div className={`${isDbOpen ? 'w-1/2' : 'w-full'} transition-all duration-300 flex flex-col justify-center relative`}>
                   
                   <div className="font-mono text-xs text-retro-gold tracking-[0.5em] mb-4">AUDIO_LOG</div>
                   
                   {/* Info Display - Responsive Text */}
                   <h1 className="text-[5vmin] font-serif font-bold text-retro-ink leading-none tracking-tight mb-2 truncate">
                       {currentSong.title}
                   </h1>
                   <h2 className="text-[3vmin] font-sans italic text-retro-gray tracking-widest mb-6 truncate">
                       {currentSong.artist}
                   </h2>

                   {/* Custom CSS Audio Visualizer */}
                   <div className="w-full h-[15vmin] border-4 border-retro-gray/30 bg-black/5 p-2 relative mb-8 flex items-end justify-between gap-1 overflow-hidden">
                        <div className="absolute top-0 left-0 text-[10px] font-mono text-retro-gray/50 p-1">FREQ_ANALYSIS</div>
                        {/* Bars */}
                        {[...Array(20)].map((_, i) => (
                            <div 
                                key={i}
                                className="flex-1 bg-retro-gold/80 transition-all duration-100 ease-in-out"
                                style={{ 
                                    height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%',
                                    opacity: isPlaying ? 1 : 0.3,
                                    transitionDelay: `${i * 10}ms`
                                }}
                            ></div>
                        ))}
                        {/* Overlay Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:100%_10px] pointer-events-none"></div>
                   </div>

                   {/* Controls */}
                   <div>
                       <button 
                            onClick={() => setIsDbOpen(!isDbOpen)}
                            className={`
                                font-mono font-bold text-sm px-6 py-3 border-2 transition-all flex items-center gap-2
                                ${isDbOpen ? 'bg-retro-gold text-retro-paper border-retro-gold' : 'bg-transparent text-retro-gold border-retro-gold hover:bg-retro-gold/10'}
                            `}
                       >
                           {isDbOpen ? '[-_] HIDE DATABASE' : '[+_] ACCESS DATABASE'}
                       </button>
                   </div>
               </div>

               {/* Right Column: Database Panel (Slide In) */}
               <div className={`
                    flex-1 border-l-2 border-dashed border-retro-gray/30 pl-[3vmin] flex flex-col overflow-hidden transition-all duration-300
                    ${isDbOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none hidden'}
               `}>
                    <div className="font-mono text-[10px] text-retro-gray/60 tracking-widest mb-4">ARCHIVE // 1999</div>
                    
                    <div className="flex gap-4 h-full overflow-hidden">
                        {/* Column 1: Categories */}
                        <div className="w-1/3 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                             {OST_DATABASE.map(cat => (
                                 <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`
                                        text-left font-mono text-xs md:text-sm p-3 border-l-2 transition-all
                                        ${selectedCategory === cat.id 
                                            ? 'border-retro-gold bg-retro-gold/10 text-retro-ink font-bold' 
                                            : 'border-retro-gray/20 text-retro-gray hover:border-retro-gray/50'}
                                    `}
                                 >
                                     <span className="opacity-50 mr-2">{cat.id}</span>
                                     {cat.label.split('//')[0]}
                                 </button>
                             ))}
                        </div>

                        {/* Column 2: Tracks */}
                        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pb-4 custom-scrollbar">
                            {selectedCategory ? (
                                OST_DATABASE.find(c => c.id === selectedCategory)?.tracks.map(track => (
                                    <button
                                        key={track.id}
                                        onClick={() => setCurrentSong(track)}
                                        className={`
                                            group text-left font-mono text-xs p-3 border border-retro-gray/20 hover:border-retro-gold transition-all relative overflow-hidden
                                            ${currentSong.id === track.id ? 'bg-retro-ink text-retro-gold' : 'bg-retro-paper-dark text-retro-ink'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <span><span className="opacity-50 mr-2">{track.id}</span> {track.title}</span>
                                            {currentSong.id === track.id && <span className="animate-pulse">▶</span>}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="h-full flex items-center justify-center text-retro-gray/40 font-mono text-xs italic">
                                    SELECT A CATEGORY...
                                </div>
                            )}
                        </div>
                    </div>
               </div>

           </div>
      </div>

    </div>
  );
};

export default MusicPage;
