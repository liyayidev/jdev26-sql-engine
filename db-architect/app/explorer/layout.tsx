
import Link from 'next/link';

export default function ExplorerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
                <div className="mb-8">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        DB-Architect
                    </Link>
                </div>

                <nav className="space-y-2 flex-1">
                    <NavItem href="/explorer/schema-builder" label="Schema Builder" icon="🏗️" />
                    <NavItem href="/explorer/playground" label="Query Playground" icon="⚡" />
                    <NavItem href="/explorer/join-simulator" label="Join Simulator" icon="🔄" />
                </nav>

                <div className="border-t pt-4">
                    <Link href="/demo" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
                        <span>📚</span> Go to Demo App
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, label, icon }: { href: string, label: string, icon: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors">
            <span>{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    )
}
