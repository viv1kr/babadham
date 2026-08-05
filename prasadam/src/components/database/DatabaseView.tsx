import React, { useState } from 'react';
import { db } from '../../db/mysqlSim';
import { Database } from 'lucide-react';

export const DatabaseView: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM products LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<any>(null);

  const handleExecuteSQL = (e: React.FormEvent) => {
    e.preventDefault();
    const result = db.executeSQL(sqlQuery);
    setSqlResult(result);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg">
        <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
          <Database className="w-5 h-5" /> MySQL Database Console & Runner
        </h3>

        <form onSubmit={handleExecuteSQL} className="space-y-3">
          <textarea
            rows={4}
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            placeholder="Enter SQL Query (e.g. SELECT * FROM products;)"
            className="w-full p-3 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 font-mono text-xs text-emerald-300 focus:outline-none focus:border-[#F4A62A]"
          />

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#FFF8F0]/60">
              Supports `SELECT * FROM products`, `SELECT * FROM orders`, etc.
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md"
            >
              Execute Query
            </button>
          </div>
        </form>

        {sqlResult && (
          <div className="mt-4 p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 overflow-x-auto space-y-2">
            <div className="text-xs font-bold text-[#F4A62A]">Query Output:</div>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#F4A62A]/30 text-[#F4A62A]">
                  {sqlResult.columns.map((c: string, idx: number) => (
                    <th key={idx} className="p-2">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sqlResult.rows.map((r: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#F4A62A]/10">
                    {sqlResult.columns.map((c: string, cIdx: number) => (
                      <td key={cIdx} className="p-2 text-white/90">{String(r[c] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
