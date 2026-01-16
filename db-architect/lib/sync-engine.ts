import { supabase } from './supabase';
import { db, Book } from './db';

type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

/**
 * Executes a dual-write operation to both Supabase and IndexedDB.
 * This demonstrates the concept of dual-persistence and sync challenges.
 */
export async function syncEntry(
    action: ActionType,
    table: 'books',
    data: Partial<Book>,
    id?: string
) {
    console.log(`[SyncEngine] Processing ${action} on ${table}`, data);

    // 1. Local DB Operation (Immediate Feedback)
    try {
        if (action === 'CREATE' && data) {
            await db.books.add({ ...data, sync_status: 'synced' } as Book);
        } else if (action === 'UPDATE' && id && data) {
            await db.books.update(id, { ...data, sync_status: 'synced' });
        } else if (action === 'DELETE' && id) {
            await db.books.delete(id);
        }
        console.log('[SyncEngine] Local DB operation successful');
    } catch (error) {
        console.error('[SyncEngine] Local DB Error:', error);
    }

    // 2. Remote DB Operation (Supabase)
    try {
        if (action === 'CREATE' && data) {
            // Remove sync_status before sending to Supabase if it's not in the schema or handled automatically
            // Assuming Supabase schema has sync_status or we ignore it. 
            // Let's sanitize data for Supabase just in case
            const { sync_status, ...remoteData } = data as any;
            const { error } = await supabase.from(table).insert(remoteData);
            if (error) throw error;
        } else if (action === 'UPDATE' && id && data) {
            const { sync_status, ...remoteData } = data as any;
            const { error } = await supabase.from(table).update(remoteData).eq('id', id);
            if (error) throw error;
        } else if (action === 'DELETE' && id) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
        }
        console.log('[SyncEngine] Remote DB operation successful');
    } catch (error) {
        console.error('[SyncEngine] Supabase Error:', error);
        // Fallback: Mark local as pending sync if remote fails
        if (id && action !== 'DELETE') {
            await db.books.update(id, { sync_status: `pending_${action.toLowerCase()}` } as any);
        }
    }
}
