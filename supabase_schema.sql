-- ==============================================================================
-- PriorArt Copilot - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Table for User Custom API Keys (BYOK - Bring Your Own Key)
CREATE TABLE IF NOT EXISTS public.user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,          -- Firebase Auth UID
    user_email TEXT,
    gemini_api_key TEXT,                   -- Custom Google Gemini API Key
    epo_consumer_key TEXT,                 -- Optional EPO OPS Key
    epo_consumer_secret TEXT,              -- Optional EPO OPS Secret
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table for Persistent Screening Reports & History
CREATE TABLE IF NOT EXISTS public.screening_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,                 -- Firebase Auth UID
    title TEXT NOT NULL,                   -- Invention Title
    technical_domain TEXT DEFAULT 'mechanical',
    summary TEXT,                          -- Brief invention summary
    risk_level TEXT DEFAULT 'MOD',         -- HIGH, MOD, or LOW
    report_data JSONB NOT NULL,            -- Full PriorArtReport + Threat Matrix
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for ultra-fast queries per user
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user ON public.user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_screening_reports_user ON public.screening_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_screening_reports_created ON public.screening_reports(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_reports ENABLE ROW LEVEL SECURITY;

-- Allow access via API Key (Anon / Service Role)
CREATE POLICY "Allow access for user keys" 
    ON public.user_api_keys 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow access for screening reports" 
    ON public.screening_reports 
    FOR ALL 
    USING (true) 
    WITH CHECK (true);
