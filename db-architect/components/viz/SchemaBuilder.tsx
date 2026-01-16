'use client';

import { useSchemaStore, ColumnType } from '@/lib/schema-store';
import { Plus, Trash2, Key, Fingerprint, Search } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming I created this earlier or will create it

export function SchemaBuilder() {
    const { tables, addTable, updateTableName, deleteTable, addColumn, updateColumn, deleteColumn } = useSchemaStore();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Schema Architect</h1>
                    <p className="text-slate-500">Design your database tables and columns.</p>
                </div>
                <button
                    onClick={() => addTable('new_table')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Table
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {tables.map(table => (
                    <div key={table.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        {/* Table Header */}
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                                <span className="text-xl">🗄️</span>
                                <input
                                    className="bg-transparent font-bold text-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 w-full"
                                    value={table.name}
                                    onChange={(e) => updateTableName(table.id, e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => deleteTable(table.id)}
                                className="text-slate-400 hover:text-red-500 p-1"
                                title="Delete Table"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Columns List */}
                        <div className="p-4 space-y-3 flex-1">
                            {table.columns.map(col => (
                                <div key={col.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg group border border-transparent hover:border-slate-100">
                                    {/* Name Input */}
                                    <input
                                        className="flex-1 bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
                                        value={col.name}
                                        placeholder="column_name"
                                        onChange={(e) => updateColumn(table.id, col.id, { name: e.target.value })}
                                    />

                                    {/* Type Select */}
                                    <select
                                        className="text-xs font-mono bg-slate-100 text-slate-600 rounded px-2 py-1 border-none focus:ring-1 focus:ring-blue-500"
                                        value={col.type}
                                        onChange={(e) => updateColumn(table.id, col.id, { type: e.target.value as ColumnType })}
                                    >
                                        <option value="INTEGER">INT</option>
                                        <option value="TEXT">TEXT</option>
                                        <option value="BOOLEAN">BOOL</option>
                                    </select>

                                    {/* Constraints Toggles */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            className={cn("p-1 rounded transition-colors", col.isPrimaryKey ? "text-yellow-500 bg-yellow-50" : "text-slate-300 hover:text-slate-500")}
                                            onClick={() => updateColumn(table.id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                                            title="Primary Key"
                                        >
                                            <Key size={14} />
                                        </button>
                                        <button
                                            className={cn("p-1 rounded transition-colors", col.isUnique ? "text-purple-500 bg-purple-50" : "text-slate-300 hover:text-slate-500")}
                                            onClick={() => updateColumn(table.id, col.id, { isUnique: !col.isUnique })}
                                            title="Unique Constraint"
                                        >
                                            <Fingerprint size={14} />
                                        </button>
                                        <button
                                            className={cn("p-1 rounded transition-colors", col.hasIndex ? "text-green-500 bg-green-50" : "text-slate-300 hover:text-slate-500")}
                                            onClick={() => updateColumn(table.id, col.id, { hasIndex: !col.hasIndex })}
                                            title="B-Tree Index"
                                        >
                                            <Search size={14} />
                                        </button>
                                    </div>

                                    {/* Delete Column */}
                                    <button
                                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                                        onClick={() => deleteColumn(table.id, col.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Column Footer */}
                        <div className="p-3 bg-slate-50 border-t border-slate-200">
                            <button
                                className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-300 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                onClick={() => addColumn(table.id, { name: 'new_col', type: 'TEXT', isPrimaryKey: false, isUnique: false, hasIndex: false })}
                            >
                                <Plus size={16} /> Add Column
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
