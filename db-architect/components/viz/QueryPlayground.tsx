'use client';

import { useSchemaStore } from '@/lib/schema-store';
import { useState } from 'react';
import { Play, RotateCcw, MonitorPlay } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure this exists

type ExecutionStep = {
    id: number;
    message: string;
    highlightRowId?: any; // The ID of the row being scanned
    type: 'SCAN' | 'MATCH' | 'INDEX_SEEK' | 'RESULT';
};

export function QueryPlayground() {
    const { tables } = useSchemaStore();
    const [query, setQuery] = useState('SELECT * FROM users WHERE id = 5');
    const [logs, setLogs] = useState<ExecutionStep[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [scannedRows, setScannedRows] = useState<Set<any>>(new Set());

    const runQuery = async () => {
        setLogs([]);
        setScannedRows(new Set());
        setIsAnimating(true);

        // 1. Parse Query (Very naive parser for demo)
        const match = query.match(/SELECT \* FROM (\w+) WHERE (\w+)\s*=\s*(.+)/i);

        if (!match) {
            setLogs([{ id: 1, message: "Syntax Error: Only supports 'SELECT * FROM [table] WHERE [col] = [val]'", type: 'RESULT' }]);
            setIsAnimating(false);
            return;
        }

        const [_, tableName, colName, valStr] = match;
        const value = parseInt(valStr.trim()) || valStr.trim().replace(/'/g, ''); // Handle numbers or strings

        // 2. Find Table
        const table = tables.find(t => t.name.toLowerCase() === tableName.toLowerCase());
        if (!table) {
            setLogs([{ id: 1, message: `Error: Table '${tableName}' not found.`, type: 'RESULT' }]);
            setIsAnimating(false);
            return;
        }

        // 3. Find Column & Check Index
        const column = table.columns.find(c => c.name === colName);
        if (!column) {
            setLogs([{ id: 1, message: `Error: Column '${colName}' not found.`, type: 'RESULT' }]);
            setIsAnimating(false);
            return;
        }

        const hasIndex = column.hasIndex;

        // 4. Execute Simulation
        const steps: ExecutionStep[] = [];
        if (hasIndex) {
            steps.push({ id: 1, message: `✅ Index found on column '${colName}'. Using B-Tree Seek.`, type: 'INDEX_SEEK' });
            steps.push({ id: 2, message: `-> Traversing B-Tree...`, type: 'INDEX_SEEK' });

            // Instant find
            const result = table.data.find(row => row[colName] == value);
            if (result) {
                steps.push({ id: 3, message: `-> Key ${value} found in index. Pointer -> Row #${result.id}`, highlightRowId: result.id, type: 'MATCH' });
                steps.push({ id: 4, message: `Query Result: ${JSON.stringify(result)}`, type: 'RESULT' });
            } else {
                steps.push({ id: 3, message: `-> Key ${value} not found in index.`, type: 'RESULT' });
            }
        } else {
            steps.push({ id: 1, message: `⚠️ No index on '${colName}'. Performing Full Table Scan.`, type: 'SCAN' });

            // Scan all rows
            table.data.forEach((row, idx) => {
                steps.push({
                    id: idx + 2,
                    message: `Scanning row ${idx + 1} (id=${row.id})... ${row[colName] == value ? 'MATCH!' : 'Skip.'}`,
                    highlightRowId: row.id,
                    type: row[colName] == value ? 'MATCH' : 'SCAN'
                });
            });

            const result = table.data.find(row => row[colName] == value);
            steps.push({ id: 999, message: result ? `Result Found: ${JSON.stringify(result)}` : "No result found.", type: 'RESULT' });
        }

        // 5. Play Animation
        for (const step of steps) {
            setLogs(prev => [...prev, step]);
            if (step.highlightRowId) {
                setScannedRows(prev => new Set(prev).add(step.highlightRowId));
            }
            await new Promise(r => setTimeout(r, hasIndex ? 600 : 300)); // Scan is fast per row, Index is slower steps to emphasize
        }

        setIsAnimating(false);
    };

    // Default table to show if query parses, or just the first table
    const activeTableName = query.match(/FROM (\w+)/i)?.[1] || tables[0]?.name;
    const activeTable = tables.find(t => t.name.toLowerCase() === activeTableName?.toLowerCase()) || tables[0];

    return (
        <div className="space-y-6">
            {/* Editor */}
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="text-slate-400 text-xs font-mono mb-1 block">SQL Query</label>
                        <input
                            className="w-full bg-slate-800 text-green-400 font-mono p-3 rounded border border-slate-700 focus:outline-none focus:border-green-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={runQuery}
                        disabled={isAnimating}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        <Play size={20} fill="currentColor" /> Run
                    </button>
                </div>

                {/* Logs Window */}
                <div className="bg-black/50 rounded p-4 font-mono text-xs h-48 overflow-y-auto space-y-1">
                    {logs.length === 0 && <span className="text-slate-500">// Ready to execute...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className={cn(
                            "transition-all duration-300",
                            log.type === 'RESULT' ? 'text-green-400 font-bold border-t border-slate-700 pt-2 mt-2' :
                                log.type === 'MATCH' ? 'text-yellow-400 font-bold' :
                                    log.type === 'INDEX_SEEK' ? 'text-blue-400' :
                                        'text-slate-300'
                        )}>
                            {log.message}
                        </div>
                    ))}
                </div>
            </div>

            {/* Visualizer */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <MonitorPlay size={20} /> Disk / Table View
                    </h3>
                    <div className="space-y-2">
                        {activeTable?.data.map((row) => (
                            <div key={row.id} className={cn(
                                "flex items-center justify-between p-3 rounded border transition-all duration-300",
                                scannedRows.has(row.id) ? "bg-yellow-50 border-yellow-300 scale-[1.02]" : "bg-slate-50 border-slate-200",
                                // If it's a match, maybe green?
                            )}>
                                <div className="font-mono text-sm text-slate-600">
                                    {JSON.stringify(row)}
                                </div>
                                <div className="text-xs text-slate-400">Row #{row.id}</div>
                            </div>
                        ))}
                        {activeTable?.data.length === 0 && <div className="text-slate-400 italic">No data in table. Add rows in Schema Builder!</div>}
                    </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-4">Concept Explanation</h3>
                    {logs.some(l => l.type === 'INDEX_SEEK') ? (
                        <div className="space-y-4 text-blue-800 text-sm">
                            <p><strong>B-Tree Seek:</strong> The engine converts the value <code>5</code> into a search key.</p>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">Root</div>
                                    <div className="h-4 w-0.5 bg-blue-300"></div>
                                    <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-xs">...</div>
                                    <div className="h-4 w-0.5 bg-blue-300"></div>
                                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">5</div>
                                </div>
                            </div>
                            <p>It skips traversing the entire table and lands directly on the leaf node pointing to the data.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-slate-600 text-sm">
                            <p><strong>Full Table Scan:</strong> The database must read every single record from disk effectively O(N) complexity.</p>
                            <p>Notice how it checks every row one by one in the "Disk View". As data grows, this becomes exponentially slower.</p>
                            <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-800">
                                💡 Tip: Go to the Schema Builder and add an Index to the queried column to see the difference!
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
