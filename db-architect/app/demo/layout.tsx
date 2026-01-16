
import Link from 'next/link';

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            BookKeeper <span className="text-xs text-slate-400 font-normal border border-slate-200 rounded px-1 ml-1">DEMO</span>
                        </Link>
                        <nav className="hidden md:flex gap-4">
                            <Link href="/demo" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                                My Books
                            </Link>
                            <Link href="/demo/admin" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                                Sync Inspector (Admin)
                            </Link>
                        </nav>
                    </div>

                    <Link href="/explorer/schema-builder" className="text-sm text-slate-400 hover:text-blue-600 flex items-center gap-1">
                        <span>🛠️</span> Back to Explorer
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
