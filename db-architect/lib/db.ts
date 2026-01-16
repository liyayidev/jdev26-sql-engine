import Dexie, { Table } from 'dexie';

export interface Book {
    id: string; // UUID
    title: string;
    author: string;
    genre?: string;
    published_year?: number;
    created_at?: string;
    sync_status?: 'synced' | 'pending_create' | 'pending_update' | 'pending_delete';
}

export class AppDatabase extends Dexie {
    books!: Table<Book>;

    constructor() {
        super('DBArchitectLocal');
        this.version(1).stores({
            books: 'id, title, author, sync_status' // Primary key and indexed props
        });
    }
}

export const db = new AppDatabase();
