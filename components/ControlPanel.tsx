import React from 'react';
import { ScrapeConfig, ScrapeStatus } from '../types';
import { Settings, ShieldAlert, Clock, Zap, PauseCircle, PlayCircle, Database, ListFilter } from 'lucide-react';

interface ControlPanelProps {
  config: ScrapeConfig;
  setConfig: (c: ScrapeConfig) => void;
  status: ScrapeStatus;
  onStart: () => void;
  onStop: () => void;
  totalCollected: number;
  nextRunTime: number | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  setConfig,
  status,
  onStart,
  onStop,
  totalCollected,
  nextRunTime
}) => {
  const isRunning = status === ScrapeStatus.RUNNING || status === ScrapeStatus.COOLDOWN;

  const handleChange = (key: keyof ScrapeConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const formatTime = (ms: number) => {
    if (!ms) return '--:--';
    const date = new Date(ms);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-indigo-400" />
          Task Configuration
        </h2>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs text-slate-400">Total Collected</p>
                <p className="text-xl font-mono text-green-400">{totalCollected}</p>
            </div>
            {nextRunTime && (
                <div className="text-right">
                    <p className="text-xs text-slate-400">Next Batch</p>
                    <p className="text-lg font-mono text-blue-400">{formatTime(nextRunTime)}</p>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timing Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
                <span className="text-slate-400 text-sm flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" /> Interval (Hrs)
                </span>
                <input
                type="number"
                value={config.intervalHours}
                onChange={(e) => handleChange('intervalHours', Number(e.target.value))}
                disabled={isRunning}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                />
            </label>

             <label className="block">
                <span className="text-slate-400 text-sm flex items-center gap-2 mb-1">
                <ListFilter className="w-4 h-4" /> Items / Key
                </span>
                <input
                type="number"
                value={config.itemsPerKeyword}
                onChange={(e) => handleChange('itemsPerKeyword', Number(e.target.value))}
                disabled={isRunning}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                />
            </label>
          </div>

           <label className="block">
            <span className="text-slate-400 text-sm flex items-center gap-2 mb-1">
              <Database className="w-4 h-4" /> Max Requests / Batch
            </span>
            <input
              type="number"
              value={config.requestsPerBatch}
              onChange={(e) => handleChange('requestsPerBatch', Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </label>
        </div>

        {/* Anti-Ban Controls */}
        <div className="space-y-4 border-l border-slate-800 pl-0 md:pl-6">
          <div className="flex items-center justify-between mb-2">
             <span className="text-slate-400 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" /> Anti-Ban Measures
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
                <span className="text-xs text-slate-500 mb-1 block">Min Delay (ms)</span>
                <input
                type="number"
                value={config.minDelayMs}
                onChange={(e) => handleChange('minDelayMs', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
                />
            </label>
            <label className="block">
                <span className="text-xs text-slate-500 mb-1 block">Max Delay (ms)</span>
                <input
                type="number"
                value={config.maxDelayMs}
                onChange={(e) => handleChange('maxDelayMs', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
                />
            </label>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={config.simulateProxy}
                    onChange={(e) => handleChange('simulateProxy', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                />
                <span className="text-sm text-slate-300">Rotate Residential Proxies</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={config.simulateUserAgent}
                    onChange={(e) => handleChange('simulateUserAgent', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                />
                <span className="text-sm text-slate-300">Randomize User-Agent</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        {!isRunning ? (
            <button
                onClick={onStart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
                <PlayCircle className="w-5 h-5" /> Start Task Loop
            </button>
        ) : (
            <button
                onClick={onStop}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
            >
                <PauseCircle className="w-5 h-5" /> Stop Task
            </button>
        )}
      </div>
    </div>
  );
};