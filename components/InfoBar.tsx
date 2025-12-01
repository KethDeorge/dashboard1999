
import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { MOCK_WEATHER } from '../constants';

interface InfoBarProps {
  currentPage: PageId;
}

const InfoBar: React.FC<InfoBarProps> = ({ currentPage }) => {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short' 
      }).toUpperCase());
      setTimeStr(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-20 md:h-24 flex items-center justify-between px-4 md:px-8 border-b-4 border-retro-gold bg-retro-paper-dark z-50 shrink-0 relative shadow-sm overflow-hidden">
      {/* Decorative Stripe */}
      <div className="absolute bottom-1 left-0 w-full h-[1px] bg-retro-gold/30"></div>
      
      {/* Decorative Background Text Scrolling */}
      <div className="absolute top-1 left-0 w-full overflow-hidden opacity-10 pointer-events-none whitespace-nowrap">
        <div className="animate-[scan_20s_linear_infinite] font-mono text-[9px] text-retro-ink">
           SYSTEM_READY // INITIALIZING_PROTOCOLS // CHECK_SUM:OK // MEMORY:ALLOCATED // AUDIO_DRIVER:LOADED // RENDER_ENGINE:ACTIVE // WAITING_FOR_INPUT // 
           SYSTEM_READY // INITIALIZING_PROTOCOLS // CHECK_SUM:OK // MEMORY:ALLOCATED // AUDIO_DRIVER:LOADED // RENDER_ENGINE:ACTIVE // WAITING_FOR_INPUT //
        </div>
      </div>

      {/* Left: Environment Data */}
      <div className="flex flex-col items-start font-mono text-retro-brown z-10">
        <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-bold text-retro-green tracking-tighter">{timeStr}</span>
            <span className="text-xs md:text-sm opacity-60">| {MOCK_WEATHER.temp}°C</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs tracking-widest opacity-80 mt-1">
            <div className="w-2 h-2 bg-retro-gold rounded-full animate-pulse-slow"></div>
            <span>{dateStr} // {MOCK_WEATHER.condition.toUpperCase()}</span>
        </div>
      </div>

      {/* Center: Page Indicator (Visual Tab) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full flex flex-col justify-end pb-3 z-10">
         <div className="flex items-end gap-1 mb-1 justify-center">
            {Object.values(PageId).map((page) => (
                <div 
                    key={page}
                    className={`
                        w-8 h-1 rounded-sm transition-all duration-300
                        ${currentPage === page ? 'bg-retro-gold w-12' : 'bg-retro-gray/30'}
                    `}
                ></div>
            ))}
         </div>
         <div className="text-center">
            <span className="font-serif font-bold text-lg md:text-2xl tracking-[0.2em] text-retro-ink border-b-2 border-transparent relative">
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-[10px] opacity-30">▶</span>
                {currentPage}
                <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-[10px] opacity-30">◀</span>
            </span>
         </div>
      </div>

      {/* Right: Tech readout */}
      <div className="flex flex-col items-end font-mono text-[10px] md:text-xs text-retro-gray z-10">
        <div className="border border-retro-gray/40 px-2 py-0.5 rounded-sm text-retro-green bg-retro-green/10 mb-1 flex gap-2">
            <span className="animate-pulse">●</span> SYS.ONLINE
        </div>
        <div className="flex gap-2 opacity-50 font-bold">
            <span>[BAT.99%]</span>
            <span>[NET.OK]</span>
        </div>
      </div>
    </div>
  );
};

export default InfoBar;
