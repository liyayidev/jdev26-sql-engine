import { QueryPlayground } from '@/components/viz/QueryPlayground';

export default function PlaygroundPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Query Playground</h1>
                <p className="text-slate-500">
                    Type a query and watch how the database engine executes it.
                </p>
            </div>

            <QueryPlayground />
        </div>
    );
}
