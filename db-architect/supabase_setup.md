# Supabase Setup Guide for DB-Architect

To make the **Dual-Persistence Demo** work fully, you need to configure your Supabase project.

## 1. Create a Project
1.  Log in to [Supabase](https://supabase.com/dashboard).
2.  Click **"New Project"**.
3.  Give it a name (e.g., `db-architect-demo`) and a secure password.
4.  Wait for the database to provision.

## 2. Get Credentials
1.  Go to **Project Settings** (Cog icon) -> **API**.
2.  Copy the **Project URL**.
3.  Copy the **anon public** key.
4.  Paste these into your `.env.local` file in the project root:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
    ```

## 3. Create the Database Schema
1.  Go to the **SQL Editor** (Terminal icon in the left sidebar).
2.  Click **"New Query"**.
3.  Paste and run the following SQL script to create the `books` table and enable Row Level Security (RLS) so the public client can access it.

```sql
-- 1. Create the books table
CREATE TABLE public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    published_year INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 3. Create a Policy to allows ALL operations for the public (anon) role
-- NOTE: In a real production app, you would restrict this to authenticated users.
-- For this educational demo, we want it to work immediately without login.
CREATE POLICY "Enable all access for all users" 
ON public.books
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Enable Realtime (Optional, for live updates)
-- Go to Database -> Replication in the dashboard to check if it's enabled, 
-- or run this (Supabase specific):
alter publication supabase_realtime add table books;
```

## 4. Verification
1.  Restart your local development server: `npm run dev`.
2.  Go to `/demo` in your browser.
3.  Add a book. It should now appear in the list and be saved to **both** your local IndexedDB and the Supabase table.
