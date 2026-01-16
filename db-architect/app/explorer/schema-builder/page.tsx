import { SchemaBuilder } from '@/components/viz/SchemaBuilder';

export default function SchemaBuilderPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <SchemaBuilder />

            {/* Educational Note */}
            <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-xl text-blue-900">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span>💡</span> B-Tree Index Visualization
                </h3>
                <p className="text-blue-800 leading-relaxed">
                    By toggling the <span className="inline-flex items-center justify-center p-1 bg-green-100 text-green-700 rounded mx-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg></span> icon,
                    you are simulating the creation of a B-Tree index structure on that column.
                    In the <strong>Query Playground</strong>, queries filtering by this column will be significantly faster (O(log n)) compared to a Full Table Scan (O(n)).
                </p>
            </div>
        </div>
    );
}
