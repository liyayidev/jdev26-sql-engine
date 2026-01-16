# DB-Architect: Educational Database Internals Suite

**DB-Architect** is a portfolio application built to demonstrate core database concepts and distributed system architectures. It was created as a preparation tool for the Pesapal Junior Developer Challenge '26.

## 🚀 Key Features

### 1. Concept Explorer
A visual playground to understand how databases work under the hood.
- **Schema Builder**: Design tables, columns, and constraints.
- **Query Playground**: Type simplified SQL (e.g., `SELECT * FROM users WHERE id = 5`) and watch an animated execution plan (Full Table Scan vs. B-Tree Index Seek).
- **Join Simulator**: Educational visualizations of Nested Loop vs. Hash Joins.

### 2. Dual-Persistence Demo (The "Shadow Backend")
A functional **Book Tracker** application that demonstrates architectural understanding of data consistency.
- **Primary Backend**: [Supabase](https://supabase.com) (PostgreSQL) - Represents the production remote source of truth.
- **Shadow Backend**: [IndexedDB](https://dexie.org) - A local browser database that mimics the operation of the remote persistence layer.
- **Sync Engine**: Every CRUD operation triggers a dual-write process.
- **Admin Inspector**: A dedicated view to compare the state of Local vs. Remote data in real-time.

## 🛠️ Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Lucide React
- **State Management**: Zustand (Client State), Dexie.js (Local DB)
- **Database**: Supabase (PostgreSQL)

## 📦 Getting Started

1. **Install Dependencies**
   ```bash
   git clone https://github.com/liyayidev/jdev26-sql-engine.git
   cd jdev26-sql-engine
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and add your Supabase credentials.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
   *(Note: The app will work partially without Supabase, falling back to local simulation logic for the Demo, but real sync requires credentials.)*

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📚 Educational Value
This project deconstructs the requirements of building a custom RDBMS by first visualizing the "What" and "Why" before tackling the "How" (the Engine itself). It shows determination to understand the problem space deeply.
