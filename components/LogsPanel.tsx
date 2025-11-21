import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal } from 'lucide-react';

interface LogsPanelProps {
  logs: LogEntry[];
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-xl h-full flex flex-col">
      <h2 className="text-sm font-bold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
        <Terminal className="w-4 h-4" /> Process Logs
      </h2>
      <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 p-2 bg-slate-950 rounded border border-slate-900/50">
        {logs.length === 0 && <div className="text-slate-600 italic">System ready...</div>}
        {logs.map((log) => (
          <div key={log.id} className={`flex gap-2 ${
            log.type === 'error' ? 'text-red-400' :
            log.type === 'warning' ? 'text-orange-400' :
            log.type === 'success' ? 'text-green-400' : 'text-slate-400'
          }`}>
            <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span>
            <span>{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};