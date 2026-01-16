'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Book } from '@/lib/db';

export default function AdminSyncPage() {
    const localBooks = useLiveQuery(() => db.books.toArray());
    const [remoteBooks, setRemoteBooks] = useState<Book[]>([]);

    const fetchRemote = async () => {
        const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
        if (data) setRemoteBooks(data as unknown as Book[]);
    };

    useEffect(() => {
        fetchRemote();
        const sub = supabase.channel('admin_books').on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, fetchRemote).subscribe();
        return () => { sub.unsubscribe(); }
    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-slate-900 text-white p-6 rounded-xl">
                <h1 className="text-3xl font-bold mb-2">Sync Inspector</h1>
                <p className="text-slate-400">
                    Compare the state of your Local Browser DB (IndexedDB) vs. the Remote Production DB (Supabase).
                    This demonstrates the concept of <strong>Dual Writes</strong> and <strong>Eventual Consistency</strong>.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Local DB State */}
                <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <span>🏠</span> Local (IndexedDB)
                        </h3>
                        <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-300">
                            {localBooks?.length || 0} records
                        </span>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Sync Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {localBooks?.map(book => (
                                    <tr key={book.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-mono text-xs text-slate-400 truncate max-w-[100px]" title={book.id}>{book.id}</td>
                                        <td className="p-3 font-medium text-slate-700">{book.title}</td>
                                        <td className="p-3">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${book.sync_status === 'synced' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {book.sync_status || 'synced'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Remote DB State */}
                <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b border-blue-200 flex justify-between items-center">
                        <h3 className="font-bold text-blue-700 flex items-center gap-2">
                            <span>☁️</span> Remote (Supabase)
                        </h3>
                        <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-blue-200 text-blue-600">
                            {remoteBooks.length} records
                        </span>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-50/50 text-blue-600 font-medium">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-50">
                                {remoteBooks.map(book => (
                                    <tr key={book.id} className="hover:bg-blue-50/30">
                                        <td className="p-3 font-mono text-xs text-slate-400 truncate max-w-[100px]" title={book.id}>{book.id}</td>
                                        <td className="p-3 font-medium text-slate-700">{book.title}</td>
                                        <td className="p-3 text-xs text-slate-500">
                                            {book.created_at ? new Date(book.created_at).toLocaleTimeString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
