export default function JoinSimulatorPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Join Operation Simulator</h1>
                <p className="text-slate-500">Visualizing how database engines combine data from two tables.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-blue-600 mb-4">Nested Loop Join</h2>
                    <div className="space-y-4 text-slate-600 text-sm">
                        <p><strong>Complexity: O(N * M)</strong></p>
                        <div className="bg-slate-100 p-4 rounded font-mono text-xs">
                            for rowA in TableA:<br />
                            &nbsp;&nbsp;for rowB in TableB:<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;if rowA.id == rowB.a_id:<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;emit(rowA, rowB)
                        </div>
                        <p>Effective for small tables but very slow for large datasets without indexes.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-emerald-600 mb-4">Hash Join</h2>
                    <div className="space-y-4 text-slate-600 text-sm">
                        <p><strong>Complexity: O(N + M)</strong></p>
                        <div className="bg-slate-100 p-4 rounded font-mono text-xs">
                            hashtable = { }<br />
                            for rowA in TableA:<br />
                            &nbsp;&nbsp;hashtable[rowA.id] = rowA<br />
                            <br />
                            for rowB in TableB:<br />
                            &nbsp;&nbsp;if rowB.a_id in hashtable:<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;emit(hashtable[rowB.a_id], rowB)
                        </div>
                        <p>Requires memory to build the hash table but is much faster for large unindexed joins.</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-center">
                Prototype Feature: Interactive animation coming soon!
            </div>
        </div>
    );
}
