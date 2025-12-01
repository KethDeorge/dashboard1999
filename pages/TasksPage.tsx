import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { PageProps, ViewMode } from '../types';

const TasksPage: React.FC<PageProps> = ({ viewMode }) => {
  const { tasks, addTask, toggleTask, removeTask } = useTasks();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="relative h-full w-full max-w-4xl mx-auto animate-fade-in flex flex-col">
      
      {/* Container - Using relative overflow hidden to mask sliding views */}
      <div className="relative flex-1 bg-retro-paper shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-retro-gray/20 overflow-hidden flex flex-col">
        
        {/* Header (Always Visible) */}
        <div className="h-20 bg-retro-green-light flex items-center px-6 justify-between shrink-0 border-b-4 border-retro-gold z-20 relative shadow-md">
            <div>
                <h2 className="text-retro-paper font-serif tracking-widest text-xl md:text-2xl font-bold">MISSION LOG</h2>
                <div className="h-1 w-full bg-retro-gold mt-1"></div>
            </div>
            <div className="text-retro-gold text-sm font-mono border border-retro-gold px-2 py-1 bg-retro-black/20">
                PENDING: {tasks.filter(t => !t.completed).length.toString().padStart(2, '0')}
            </div>
        </div>

        {/* --- VIEW: CONFIG (Input) --- */}
        <div className={`
             absolute top-20 left-0 right-0 h-32 bg-retro-paper-dark border-b-2 border-retro-brown z-10 transition-transform duration-500 ease-in-out p-6 flex items-center shadow-lg
             ${viewMode === ViewMode.CONFIG ? 'translate-y-0' : '-translate-y-full'}
        `}>
            <div className="w-full flex gap-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="ENTER NEW DIRECTIVE..."
                    className="flex-1 bg-retro-paper border-2 border-retro-gray/50 focus:border-retro-gold outline-none font-mono text-lg text-retro-ink px-4 py-3 placeholder-retro-gray/40 shadow-inner"
                />
                <button 
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className="w-24 bg-retro-brown text-retro-paper font-bold font-serif uppercase tracking-widest hover:bg-retro-green transition-colors disabled:opacity-50 disabled:bg-retro-gray"
                >
                    ADD
                </button>
            </div>
        </div>

        {/* --- VIEW: MAIN (List) --- */}
        {/* Pushed down by Config view visually if we wanted, but here we slide the input OVER or PUSH list down? 
            Let's keep List static and Input slides down from top (behind header, in front of list).
            Actually, let's blur the list when Config is open to focus attention.
        */}
        <div 
            className={`
                flex-1 overflow-y-auto p-6 space-y-2 bg-[linear-gradient(rgba(200,200,200,0.2)_1px,transparent_1px)] bg-[length:100%_40px] transition-all duration-500
                ${viewMode === ViewMode.CONFIG ? 'pt-32 opacity-50 blur-[1px]' : 'pt-6 opacity-100'}
            `}
            style={{ touchAction: 'pan-y' }}
        >
             {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-retro-gray opacity-60">
                    <span className="font-serif italic text-xl">No active directives.</span>
                    <span className="font-mono text-xs mt-2">-- END OF FILE --</span>
                </div>
             )}
             
             {tasks.map(task => (
                 <div 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="group flex items-start gap-4 p-3 cursor-pointer select-none hover:bg-retro-gold/10 transition-colors border-b border-dashed border-retro-gray/30 min-h-[60px]"
                 >
                    <div className={`
                        w-8 h-8 mt-1 border-2 flex items-center justify-center transition-all duration-300 shrink-0 rounded-sm
                        ${task.completed ? 'border-retro-green bg-retro-green' : 'border-retro-brown bg-transparent'}
                    `}>
                        {task.completed && <span className="text-retro-paper text-lg font-bold">✓</span>}
                    </div>
                    
                    <div className="flex-1">
                        <div className={`
                            font-serif text-xl md:text-2xl leading-tight transition-all duration-300
                            ${task.completed ? 'line-through text-retro-gray opacity-50' : 'text-retro-ink font-semibold'}
                        `}>
                            {task.title}
                        </div>
                        <div className="text-[10px] font-mono text-retro-gray mt-1 opacity-60">
                            ID: {task.id.slice(-4).toUpperCase()}
                        </div>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); removeTask(task.id); }}
                        className="text-retro-red opacity-50 group-hover:opacity-100 font-bold text-sm font-mono px-4 py-2 border border-transparent hover:border-retro-red"
                    >
                        DEL
                    </button>
                 </div>
             ))}
             {/* Spacer */}
             <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;