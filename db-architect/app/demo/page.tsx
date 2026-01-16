'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookForm } from '@/components/demo/BookForm';
import { Book } from '@/lib/db';
import { Trash2, RefreshCw } from 'lucide-react';
import { syncEntry } from '@/lib/sync-engine';

export default function DemoPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchBooks = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                // Check for specific common errors
                if (error.code === 'PGRST116' || error.message.includes('relation "books" does not exist')) {
                    setErrorMsg("Table 'books' missing. Run the setup SQL script!");
                } else if (error.message.includes('Invalid API Key') || error.message.includes('fetch failed')) {
                    setErrorMsg("Connection failed. Check your Supabase URL/Key in .env.local");
                } else {
                    setErrorMsg(error.message);
                }
            } else if (data) {
                setBooks(data);
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();

        // Optional: Subscribe to realtime changes
        const subscription = supabase
            .channel('public:books')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
                fetchBooks();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const handleDelete = async (id: string) => {
        await syncEntry('DELETE', 'books', {}, id);
        // Optimistic update not needed if realtime is fast, but good for UX
        setBooks(books.filter(b => b.id !== id));
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar: Form */}
            <div className="lg:col-span-1">
                <BookForm onSuccess={fetchBooks} />
            </div>

            {/* Main: List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Library Collection</h2>
                    <button onClick={fetchBooks} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <RefreshCw size={20} />
                    </button>
                </div>

                {errorMsg && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
                        <span>⚠️ {errorMsg}</span>
                        <a href="/supabase_setup.md" target="_blank" className="underline font-bold">View Setup Guide</a>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading library...</div>
                ) : books.length === 0 ? (
                    <div className="bg-slate-100 rounded-xl p-8 text-center text-slate-500 border border-dashed border-slate-300">
                        No books found. Add one to see the dual-write magic!
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {books.map((book) => (
                            <div key={book.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800">{book.title}</h4>
                                    <p className="text-slate-500 text-sm">by {book.author}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{book.genre}</span>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{book.published_year}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="text-slate-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
