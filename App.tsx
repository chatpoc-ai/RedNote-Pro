import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { DataView } from './components/DataView';
import { LogsPanel } from './components/LogsPanel';
import { generateSimulatedPosts } from './services/geminiService';
import { LogEntry, PostData, ScrapeConfig, ScrapeStatus } from './types';
import { LayoutGrid, List } from 'lucide-react';

// Initial Keywords
const DEFAULT_KEYWORDS = [
    "OOTD", "Skincare Routine", "Travel Japan", "Coffee Shop", 
    "Home Decor", "Cat Funny", "Healthy Diet", "Street Photography"
];

const App: React.FC = () => {
  // State
  const [keywords, setKeywords] = useState<string>(DEFAULT_KEYWORDS.join('\n'));
  const [config, setConfig] = useState<ScrapeConfig>({
    intervalHours: 1,
    requestsPerBatch: 2500,
    itemsPerKeyword: 5, // Default set to 5 for demo speed, user can change to 50
    minDelayMs: 1000,
    maxDelayMs: 3000,
    simulateProxy: true,
    simulateUserAgent: true
  });
  
  const [status, setStatus] = useState<ScrapeStatus>(ScrapeStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [data, setData] = useState<PostData[]>([]);
  const [nextRunTime, setNextRunTime] = useState<number | null>(null);

  // Refs for interval management
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Logging Helper
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-99), { // Keep last 100 logs
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      message,
      type
    }]);
  }, []);

  // Main Scraping Logic (Simulated)
  const runScrapeBatch = useCallback(async () => {
    const keywordList = keywords.split('\n').filter(k => k.trim().length > 0);
    
    addLog(`Starting batch for ${keywordList.length} keywords...`, 'info');
    
    // Create new abort controller for this batch
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    let processed = 0;

    for (const keyword of keywordList) {
      if (signal.aborted) {
        addLog('Batch aborted by user.', 'warning');
        break;
      }

      // Simulate Anti-Ban Delay
      const delay = Math.floor(Math.random() * (config.maxDelayMs - config.minDelayMs + 1)) + config.minDelayMs;
      addLog(`Processing "${keyword}"... (Waiting ${delay}ms for safety)`, 'info');
      
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate/Fetch Data
      try {
        // Pass the itemsPerKeyword config to the generator
        const newPosts = await generateSimulatedPosts(keyword.trim(), config.itemsPerKeyword);
        
        // Update data and sort by Date (Newest first) as per requirement
        setData(prev => {
            const combined = [...newPosts, ...prev];
            return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
        
        addLog(`Collected ${newPosts.length} posts for "${keyword}"`, 'success');
        processed++;
      } catch (e) {
        addLog(`Failed to process ${keyword}`, 'error');
      }
    }

    if (!signal.aborted) {
        addLog(`Batch complete. Processed ${processed} keywords.`, 'success');
        // Schedule next run
        const nextTime = Date.now() + (config.intervalHours * 60 * 60 * 1000);
        setNextRunTime(nextTime);
        setStatus(ScrapeStatus.COOLDOWN);
    } else {
        setStatus(ScrapeStatus.IDLE);
        setNextRunTime(null);
    }

  }, [keywords, config, addLog]);

  // Scheduler Effect
  useEffect(() => {
    if (status === ScrapeStatus.COOLDOWN && nextRunTime) {
      const checkInterval = setInterval(() => {
        const now = Date.now();
        if (now >= nextRunTime) {
          setStatus(ScrapeStatus.RUNNING);
          runScrapeBatch();
        }
      }, 1000); // Check every second

      return () => clearInterval(checkInterval);
    }
  }, [status, nextRunTime, runScrapeBatch]);

  const handleStart = () => {
    setStatus(ScrapeStatus.RUNNING);
    runScrapeBatch();
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStatus(ScrapeStatus.PAUSED);
    setNextRunTime(null);
    addLog('Task stopped by user.', 'warning');
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200">
      {/* Sidebar / Configuration */}
      <div className="w-80 border-r border-slate-800 bg-slate-900 p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xl mb-4">
            <LayoutGrid className="w-6 h-6" />
            <span>RedNote Pro</span>
        </div>

        <div className="flex-1 flex flex-col gap-2 min-h-0">
            <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <List className="w-4 h-4" /> Target Keywords (1 per line)
            </label>
            <textarea
                className="flex-1 bg-slate-950 border border-slate-700 rounded-md p-3 text-sm focus:ring-1 focus:ring-rose-500 focus:outline-none resize-none font-mono text-slate-300"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords..."
                disabled={status === ScrapeStatus.RUNNING}
            />
        </div>
        
        <div className="h-1/3 min-h-[200px]">
            <LogsPanel logs={logs} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 pb-0">
             <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-500/20 rounded text-xs text-indigo-300">
                <strong>Note:</strong> This application simulates the scraping process using AI to generate realistic sample data. 
                Direct client-side scraping of RedNote (Xiaohongshu) is blocked by browser security policies (CORS). 
                This demo mimics the logic, timing, and data structure of a real backend Python scraper.
            </div>
            <ControlPanel 
                config={config} 
                setConfig={setConfig} 
                status={status}
                onStart={handleStart}
                onStop={handleStop}
                totalCollected={data.length}
                nextRunTime={nextRunTime}
            />
        </div>

        <div className="flex-1 p-6 min-h-0">
            <DataView data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;