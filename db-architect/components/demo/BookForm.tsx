'use client';

import { useState } from 'react';
import { syncEntry } from '@/lib/sync-engine';
import { generateId } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function BookForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: 'Fiction',
        published_year: new Date().getFullYear()
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Dual-Write Operation
            await syncEntry('CREATE', 'books', {
                ...formData,
                id: generateId(), // Optimization: Generate ID client-side for consistency
                created_at: new Date().toISOString()
            });

            // Reset form
            setFormData({
                title: '',
                author: '',
                genre: 'Fiction',
                published_year: new Date().getFullYear()
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Failed to add book", err);
            alert("Failed to add book. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Add New Book</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Title</label>
                <input
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="The Great Gatsby"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Author</label>
                    <input
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        value={formData.author}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        placeholder="F. Scott Fitzgerald"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Year</label>
                    <input
                        type="number"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        value={formData.published_year}
                        onChange={e => setFormData({ ...formData, published_year: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Add Book to Library'}
            </button>

            <p className="text-xs text-slate-400 text-center">
                Writes to: 1. Supabase (Remote) & 2. IndexedDB (Local)
            </p>
        </form>
    );
}
