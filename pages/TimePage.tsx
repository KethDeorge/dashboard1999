
import React, { useState, useEffect } from 'react';
import { PageProps, ViewMode } from '../types';

// Interfaces for experimental browser APIs
interface BatteryManager extends EventTarget {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

interface NetworkInformation extends EventTarget {
  rtt?: number; // Round-trip time
  downlink?: number; // Bandwidth
  effectiveType?: string; // '4g', '3g', etc.
}

const TimePage: React.FC<PageProps> = ({ viewMode }) => {
  const [time, setTime] = useState(new Date());
  
  // State for stats
  const [stats, setStats] = useState({
    battery: 92,
    isCharging: false,
    voltage: 12.4, // Web API cannot access real voltage, keeping simulated
    latency: 24,
    memory: 45
  });

  const [usingRealBattery, setUsingRealBattery] = useState(false);

  useEffect(() => {
    // 1. Clock Timer & Jitter for non-real data
    const timer = setInterval(() => {
        setTime(new Date());
        
        setStats(prev => {
            // Only simulate battery if we couldn't get the real API
            const newBattery = usingRealBattery 
                ? prev.battery 
                : Math.max(0, Math.min(100, prev.battery + (Math.random() > 0.9 ? (Math.random() > 0.5 ? -1 : 0) : 0)));

            return {
                ...prev,
                battery: newBattery,
                voltage: 12.4 + (Math.random() * 0.2 - 0.1), // Voltage is always simulated (Web API limitation)
                // If we have network info, latency might be real, otherwise simulate
                latency: ('connection' in navigator) ? prev.latency : Math.floor(20 + Math.random() * 15),
                // Memory is usually restricted, simulate slight fluctuation
                memory: Math.min(99, Math.max(30, prev.memory + (Math.random() * 4 - 2)))
            };
        });
    }, 1000);

    // 2. Real Battery API Implementation
    let batteryCleanup: () => void = () => {};
    
    if ('getBattery' in navigator) {
        // Cast to any because standard TS lib might not include getBattery yet
        (navigator as any).getBattery().then((battery: BatteryManager) => {
            setUsingRealBattery(true);
            
            const updateBattery = () => {
                setStats(prev => ({
                    ...prev,
                    battery: Math.round(battery.level * 100),
                    isCharging: battery.charging
                }));
            };
            
            updateBattery();
            battery.addEventListener('levelchange', updateBattery);
            battery.addEventListener('chargingchange', updateBattery);
            
            batteryCleanup = () => {
                battery.removeEventListener('levelchange', updateBattery);
                battery.removeEventListener('chargingchange', updateBattery);
            };
        }).catch(() => {
            console.log("Battery API failed or not supported");
        });
    }

    // 3. Real Network Information (Chrome/Android mostly)
    if ('connection' in navigator) {
        const connection = (navigator as any).connection as NetworkInformation;
        const updateNetwork = () => {
             if (connection.rtt) {
                 setStats(prev => ({ ...prev, latency: connection.rtt || 24 }));
             }
        };
        updateNetwork();
    }

    // 4. Real Memory (Chrome Only - performance.memory)
    if ((performance as any).memory) {
        const mem = (performance as any).memory;
        const usedPct = Math.round((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100);
        setStats(prev => ({ ...prev, memory: usedPct || 45 }));
    }

    return () => {
        clearInterval(timer);
        batteryCleanup();
    };
  }, [usingRealBattery]);

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
                      <span>{stats.voltage.toFixed(1)}V</span>
                  </div>
                  <div className="w-full h-[2vmin] bg-retro-gray/20 border border-retro-gray/40 p-[2px]">
                      <div 
                        className={`h-full transition-all duration-1000 ${stats.isCharging ? 'bg-retro-gold animate-pulse' : 'bg-retro-green'}`} 
                        style={{ width: `${stats.battery}%` }}
                      ></div>
                  </div>
                  <div className="text-right font-mono text-[1.5vmin] text-retro-gold flex flex-col items-end">
                      <span>{stats.battery}% // {stats.isCharging ? 'CHARGING' : 'DISCHARGING'}</span>
                      {!usingRealBattery && (
                          <span className="text-[1.2vmin] text-retro-red/80 mt-1 font-bold">⚠ SIMULATION MODE (API UNAVAILABLE)</span>
                      )}
                  </div>
              </div>

              {/* STATUS 2: NETWORK */}
              <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-mono text-[1.5vmin] text-retro-gray tracking-widest">
                      <span>UPLINK_SIG</span>
                      <span>{stats.latency}ms</span>
                  </div>
                  <div className="flex gap-1 h-[3vmin] items-end">
                      {[1,2,3,4,5,6,7,8].map(i => (
                          <div 
                            key={i} 
                            className={`flex-1 transition-all duration-300 ${i < 6 ? 'bg-retro-ink' : 'bg-retro-gray/20'}`}
                            style={{ height: `${Math.min(100, (1000/stats.latency) * 10 * Math.random() + 20)}%` }}
                          ></div>
                      ))}
                  </div>
                  <div className="text-right font-mono text-[1.5vmin] text-retro-gold">SECURE CONNECTION</div>
              </div>

               {/* STATUS 3: MEMORY */}
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-mono text-[1.5vmin] text-retro-gray tracking-widest">
                      <span>BUFFER_MEM</span>
                      <span>{Math.round(stats.memory)}%</span>
                  </div>
                  <div className="w-full h-[1vmin] bg-retro-gray/20 overflow-hidden flex gap-[2px]">
                      {Array.from({length: 20}).map((_, i) => (
                           <div 
                                key={i}
                                className={`flex-1 ${i / 20 * 100 < stats.memory ? 'bg-retro-red' : 'bg-transparent'}`}
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
