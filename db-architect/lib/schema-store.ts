import { generateId } from '@/lib/utils';
import { create } from 'zustand';

export type ColumnType = 'INTEGER' | 'TEXT' | 'BOOLEAN';

export interface Column {
    id: string;
    name: string;
    type: ColumnType;
    isPrimaryKey: boolean;
    isUnique: boolean;
    hasIndex: boolean;
}

export interface TableSchema {
    id: string;
    name: string;
    columns: Column[];
    data: Record<string, any>[]; // Simulated data rows
}

interface SchemaState {
    tables: TableSchema[];
    addTable: (name: string) => void;
    updateTableName: (id: string, name: string) => void;
    deleteTable: (id: string) => void;
    addColumn: (tableId: string, column: Omit<Column, 'id'>) => void;
    updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
    deleteColumn: (tableId: string, columnId: string) => void;
    addRow: (tableId: string, row: Record<string, any>) => void;
}

// Simple UUID generator fallback


export const useSchemaStore = create<SchemaState>((set) => ({
    tables: [
        {
            id: 'table-1',
            name: 'users',
            columns: [
                { id: 'c1', name: 'id', type: 'INTEGER', isPrimaryKey: true, isUnique: true, hasIndex: true },
                { id: 'c2', name: 'username', type: 'TEXT', isPrimaryKey: false, isUnique: true, hasIndex: false },
            ],
            data: [
                { id: 1, username: 'alice' },
                { id: 5, username: 'bob' },
                { id: 12, username: 'charlie' }
            ]
        }
    ],
    addTable: (name) => set((state) => ({
        tables: [...state.tables, {
            id: generateId(),
            name,
            columns: [{ id: generateId(), name: 'id', type: 'INTEGER', isPrimaryKey: true, isUnique: true, hasIndex: true }],
            data: []
        }]
    })),
    updateTableName: (id, name) => set((state) => ({
        tables: state.tables.map(t => t.id === id ? { ...t, name } : t)
    })),
    deleteTable: (id) => set((state) => ({
        tables: state.tables.filter(t => t.id !== id)
    })),
    addColumn: (tableId, column) => set((state) => ({
        tables: state.tables.map(t => t.id === tableId ? {
            ...t,
            columns: [...t.columns, { ...column, id: generateId() }]
        } : t)
    })),
    updateColumn: (tableId, columnId, updates) => set((state) => ({
        tables: state.tables.map(t => t.id === tableId ? {
            ...t,
            columns: t.columns.map(c => c.id === columnId ? { ...c, ...updates } : c)
        } : t)
    })),
    deleteColumn: (tableId, columnId) => set((state) => ({
        tables: state.tables.map(t => t.id === tableId ? {
            ...t,
            columns: t.columns.filter(c => c.id !== columnId)
        } : t)
    })),
    addRow: (tableId, row) => set((state) => ({
        tables: state.tables.map(t => t.id === tableId ? {
            ...t,
            data: [...t.data, row]
        } : t)
    }))
}));
