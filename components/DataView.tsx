import React from 'react';
import { PostData } from '../types';
import { Download, ExternalLink } from 'lucide-react';
import { exportToCSV } from '../utils/csvHelper';

interface DataViewProps {
  data: PostData[];
}

export const DataView: React.FC<DataViewProps> = ({ data }) => {
  const handleExport = () => {
    if (data.length === 0) return;
    exportToCSV(data, `redbook_scrape_${new Date().toISOString().slice(0,10)}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Captured Data <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{data.length}</span>
        </h2>
        <button 
            onClick={handleExport}
            disabled={data.length === 0}
            className="text-sm bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download className="w-4 h-4" /> Export Excel/CSV
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-slate-800 rounded-lg bg-slate-950">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800">Keyword</th>
              <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800 w-1/3">Title / Content</th>
              <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800">Metrics</th>
              <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800">Date</th>
              <th className="p-3 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-800">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {data.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                        No data collected yet. Start the task to begin simulation.
                    </td>
                </tr>
            ) : (
                data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 align-top font-medium text-indigo-300">{row.keyword}</td>
                    <td className="p-3 align-top">
                        <div className="font-bold text-slate-200 mb-1 line-clamp-1">{row.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-2">{row.content}</div>
                        <div className="text-xs text-indigo-400 mt-1">@{row.author}</div>
                    </td>
                    <td className="p-3 align-top text-xs space-y-1">
                        <div className="flex items-center gap-1"><span className="text-rose-400">♥</span> {row.likes}</div>
                        <div className="flex items-center gap-1"><span className="text-blue-400">💬</span> {row.comments}</div>
                    </td>
                    <td className="p-3 align-top text-xs text-slate-500">{row.date}</td>
                    <td className="p-3 align-top">
                        <a href={row.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};