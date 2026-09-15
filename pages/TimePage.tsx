
import React, { useState, useEffect } from 'react';
import { PageProps, ViewMode } from '../types';

const TimePage: React.FC<PageProps> = ({ viewMode, deviceStatus }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const battery = deviceStatus?.batteryPercent;
  const latency = deviceStatus?.latencyMs;
  const memory = deviceStatus?.memoryPercent;
  const signalBars = latency == null ? 0 : latency < 100 ? 8 : latency < 250 ? 6 : latency < 500 ? 4 : 2;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center animate-fade-in text-retro-ink overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${viewMode === ViewMode.CONFIG ? 'w-[50vmin] h-[50vmin] opacity-10' : 'w-[70vmin] h-[70vmin] opacity-100'}
          border-[1px] border-retro-gold/30 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center
      `}>
          {/* Inner circle decor */}
          <div className="w-[90%] h-[90%] border border-dashed border-retro-gold/20 rounded-full"></div>
      </div>
      
      <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${viewMode === ViewMode.CONFIG ? 'w-[40vmin] h-[40vmin] opacity-10' : 'w-[60vmin] h-[60vmin] opacity-80'}
          border border-retro-gray/20 rounded-full animate-[spin_40s_linear_infinite_reverse]
      `}>
          {/* Tick marks on ring */}
          <div className="absolute top-0 left-1/2 w-[2px] h-4 bg-retro-gray/40 -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-[2px] h-4 bg-retro-gray/40 -translate-x-1/2"></div>
          <div className="absolute left-0 top-1/2 h-[2px] w-4 bg-retro-gray/40 -translate-y-1/2"></div>
          <div className="absolute right-0 top-1/2 h-[2px] w-4 bg-retro-gray/40 -translate-y-1/2"></div>
      </div>

      {/* Main Clock Card - Uses vmin for responsiveness */}
      <div className={`
        relative z-10 flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${viewMode === ViewMode.CONFIG 
            ? 'scale-[0.90] -translate-x-[25%]' // Use % instead of fixed vw for better responsiveness
            : 'scale-100 translate-x-0'
        }
      `}>
        <div className="font-mono text-xs md:text-sm text-retro-gold tracking-[0.5em] mb-4 border-b border-retro-gold/50 pb-1 flex justify-between w-full">
            <span>CHRONOMETER</span>
            <span className="opacity-50">TM-01</span>
        </div>

        {/* TIME: Responsive Font Size (vmin) */}
        <h1 className="text-[28vmin] font-serif leading-none tracking-tighter text-retro-green drop-shadow-lg select-none whitespace-nowrap z-20">
            {formatTime(time)}
        </h1>
        
        {/* Date Box */}
        <div className="mt-[2vmin] px-8 py-2 bg-retro-brown text-retro-paper text-[4vmin] font-sans italic tracking-widest uppercase shadow-md relative whitespace-nowrap z-20">
            {/* Decors on label */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-retro-gold"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-retro-gold"></div>
            {formatDate(time)}
        </div>

        {/* Decorative Time Scale / Ruler */}
        <div className="w-full h-8 mt-[4vmin] relative flex justify-between items-start opacity-50">
             {[...Array(20)].map((_, i) => (
                 <div key={i} className={`w-[1px] bg-retro-gold ${i % 5 === 0 ? 'h-4' : 'h-2'}`}></div>
             ))}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-retro-gold/30"></div>
        </div>
      </div>

      {/* --- DASHBOARD WIDGETS --- */}
      <div className={`
          absolute right-0 top-0 bottom-0 w-[50%] md:w-[40%] bg-retro-paper-dark/95 border-l-4 border-retro-gold
          flex flex-col p-[3vmin] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] z-20 shadow-2xl
          ${viewMode === ViewMode.CONFIG ? 'translate-x-0' : 'translate-x-full'}
      `}>
          <div className="h-full flex flex-col justify-center gap-[4vmin] overflow-y-auto">
              <h3 className="font-serif font-bold text-retro-ink tracking-widest text-[3vmin] border-b-2 border-retro-gold pb-2">SYS.STATUS</h3>
              
              {/* STATUS 1: POWER */}
              <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-mono text-[1.5vmin] text-retro-gray tracking-widest">
                      <span>POWER_LEVEL</span>
                      <span>{battery == null ? 'N/A' : `${battery}%`}</span>
                  </div>
                  <div className="w-full h-[2vmin] bg-retro-gray/20 border border-retro-gray/40 p-[2px]">
                      <div 
                        className={`h-full transition-all duration-1000 ${deviceStatus?.isCharging ? 'bg-retro-gold animate-pulse' : 'bg-retro-green'}`}
                        style={{ width: `${battery ?? 0}%` }}
                      ></div>
                  </div>
                  <div className="text-right font-mono text-[1.5vmin] text-retro-gold flex flex-col items-end">
                      <span>{battery == null ? 'N/A // DEVICE API UNAVAILABLE' : `${battery}% // ${deviceStatus?.isCharging ? 'CHARGING' : 'DISCHARGING'}`}</span>
                  </div>
              </div>

              {/* STATUS 2: NETWORK */}
              <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-mono text-[1.5vmin] text-retro-gray tracking-widest">
                      <span>UPLINK_SIG</span>
                      <span>{latency == null ? 'N/A' : `${latency}ms`}</span>
                  </div>
                  <div className="flex gap-1 h-[3vmin] items-end">
                      {[1,2,3,4,5,6,7,8].map(i => (
                          <div 
                            key={i} 
                            className={`flex-1 transition-all duration-300 ${i <= signalBars ? 'bg-retro-ink' : 'bg-retro-gray/20'}`}
                            style={{ height: `${20 + i * 10}%` }}
                          ></div>
                      ))}
                  </div>
                  <div className="text-right font-mono text-[1.5vmin] text-retro-gold">{deviceStatus?.isOnline ? `${deviceStatus.connectionType.toUpperCase()} CONNECTION` : 'OFFLINE'}</div>
              </div>

               {/* STATUS 3: MEMORY */}
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-mono text-[1.5vmin] text-retro-gray tracking-widest">
                      <span>BUFFER_MEM</span>
                      <span>{memory == null ? 'N/A' : `${memory}%`}</span>
                  </div>
                  <div className="w-full h-[1vmin] bg-retro-gray/20 overflow-hidden flex gap-[2px]">
                      {Array.from({length: 20}).map((_, i) => (
                           <div 
                                key={i}
                                className={`flex-1 ${memory != null && i / 20 * 100 < memory ? 'bg-retro-red' : 'bg-transparent'}`}
                           ></div>
                      ))}
                  </div>
               </div>

              <div className="mt-auto font-mono text-[1.2vmin] text-retro-gray/40 text-center tracking-[0.5em] animate-pulse">
                  /// NO ALERTS DETECTED ///
              </div>
          </div>
      </div>
      
    </div>
  );
};

export default TimePage;
