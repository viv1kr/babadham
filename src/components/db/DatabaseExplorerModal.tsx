import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../db/mysqlSim';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, X, Play, Download, Table, Terminal } from 'lucide-react';

export const DatabaseExplorerModal: React.FC = () => {
  const { isDatabaseExplorerOpen, setIsDatabaseExplorerOpen } = useStore();
  const [activeTable, setActiveTable] = useState<string>('products');
  const [customSQL, setCustomSQL] = useState<string>('SELECT * FROM products;');
  const [queryResult, setQueryResult] = useState<any | null>(null);

  if (!isDatabaseExplorerOpen) return null;

  const tables = db.getTableSchema();
  const currentSchema = tables.find(t => t.tableName === activeTable);

  const handleRunSQL = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = db.executeSQL(customSQL);
    setQueryResult(result);
  };

  const handleSelectTable = (tableName: string) => {
    setActiveTable(tableName);
    const sql = `SELECT * FROM ${tableName.toUpperCase()};`;
    setCustomSQL(sql);
    const res = db.executeSQL(sql);
    setQueryResult(res);
  };

  const handleDownloadSQL = () => {
    const dump = db.generateSQLDump();
    const blob = new Blob([dump], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `babadham_mysql_dump_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#2B1A16]/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-[#1E1B18] text-[#FFF8F0] rounded-3xl shadow-2xl border-2 border-[#F4A62A]/60 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="bg-[#7A1126] px-6 py-4 border-b border-[#F4A62A]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F4A62A] text-[#2B1A16]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-temple font-bold text-xl text-[#F4A62A] leading-tight">
                  MySQL Relational Database Inspector
                </h3>
                <p className="text-[11px] text-[#FFF8F0]/70 font-mono">
                  Engine: InnoDB • Host: localhost:3306 • DB: babadham_db
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadSQL}
                className="px-3 py-1.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export .SQL Dump</span>
              </button>
              <button
                onClick={() => setIsDatabaseExplorerOpen(false)}
                className="p-2 text-[#FFF8F0] hover:bg-[#FFF8F0]/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Tables Sidebar */}
            <div className="w-full md:w-64 bg-[#141210] p-4 border-r border-white/10 space-y-4">
              <div className="text-xs font-bold text-[#F4A62A] uppercase tracking-wider flex items-center gap-1.5">
                <Table className="w-4 h-4" /> Database Tables ({tables.length})
              </div>

              <div className="space-y-1">
                {tables.map(t => (
                  <button
                    key={t.tableName}
                    onClick={() => handleSelectTable(t.tableName)}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono font-medium text-left flex items-center justify-between transition-all ${
                      activeTable === t.tableName 
                        ? 'bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40 font-bold' 
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{t.tableName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-gray-400">
                      {t.rowCount} rows
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main SQL Console & Data Grid */}
            <div className="flex-1 p-6 flex flex-col overflow-y-auto space-y-6">
              
              {/* Query Box */}
              <form onSubmit={handleRunSQL} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#F4A62A]">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-4 h-4" /> SQL Query Console
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">Try: SELECT * FROM PRODUCTS or ORDERS</span>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSQL}
                    onChange={e => setCustomSQL(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#F4A62A]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#7A1126] text-[#F4A62A] font-bold text-xs hover:bg-[#D98C1F] hover:text-[#2B1A16] transition-colors flex items-center gap-1.5 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Query</span>
                  </button>
                </div>
              </form>

              {/* Data Table Output */}
              <div className="flex-1 space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Result Set Output {queryResult ? `(${queryResult.rows.length} rows)` : ''}
                </div>

                <div className="border border-white/10 rounded-2xl overflow-x-auto bg-black/40 max-h-72">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-[#7A1126]/60 text-[#F4A62A] border-b border-white/10">
                        {queryResult ? queryResult.columns.map((col: string) => (
                          <th key={col} className="px-4 py-3 font-semibold uppercase tracking-wider">{col}</th>
                        )) : currentSchema?.columns.map(col => (
                          <th key={col} className="px-4 py-3 font-semibold uppercase tracking-wider">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {queryResult ? (
                        queryResult.rows.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            {queryResult.columns.map((col: string) => (
                              <td key={col} className="px-4 py-2.5 max-w-xs truncate">
                                {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        currentSchema?.sampleData.map((row: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            {currentSchema.columns.map((col: string) => (
                              <td key={col} className="px-4 py-2.5 max-w-xs truncate">
                                {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
